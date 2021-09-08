/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, UnauthorizedException } from "@nestjs/common"
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { NewOrderDTO } from "../dto/newOrder.dto"
import { OrderService } from "./order.service"
import { JWTService } from "../../authentication/services/jwt.service"
// import { ShopService } from "../../shop/services/shop.service"
import { Shop, ShopDocument } from "../../shop/schemas/shop.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { LocationService } from "../../location/services/location.service"
import { DeliveryStatusChangeDTO } from "../dto/deliveryStatusChange.dto"

@WebSocketGateway({
    cors: {
        origin: "*"
    },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private connectedSockets: any[]
    private sellerRoom: string = "sellerRoom"
    private adminRoom: string = "adminRoom"
    private deliverymanRoom: string = "deliverymanRoom"
    constructor(
        @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
        private orderService: OrderService,
        private jwtService: JWTService,
        private locationService: LocationService,
    ) {
        this.connectedSockets = []
    }

    @WebSocketServer() wsServer!: Server

    handleDisconnect(socket: Socket) {
        console.log(socket.id + " " + "disconneted")
        this.connectedSockets.forEach((client, index, array) => {
            array.splice(index, 1)
        })
    }
    afterInit() {
        console.log("socket.io initialized")
    }

    async handleConnection(socket: Socket, data: any) {
        const authToken = socket.handshake.headers.authorization

        if (!(authToken)) {
            throw new UnauthorizedException()
        }

        const jwt = authToken.split(' ')[1]
        const user: any = this.jwtService.verifyToken(jwt)

        if (user.aud === "seller") {   
            const shopToken = socket.handshake.headers["x-shop-jwt"];
            if (typeof shopToken === "string") {
                const shopJwt = shopToken.split(" ")[1]
                const shop: any = this.jwtService.verifyToken(shopJwt, {
                    audience: "shop"
                })
                socket.join(this.sellerRoom)
                const userClient = {
                    socketId: socket.id,
                    userId: user.sub,
                    shopId: shop.sub,
                    role: user.aud,
                    room: this.sellerRoom
                }
                this.connectedSockets.push(userClient)
            }
        }
        else if (user.aud === "admin") {
            socket.join(this.adminRoom)
            const userClient = {
                socketId: socket.id,
                userId: user.sub,
                role: user.aud,
                room: this.adminRoom
            }
            this.connectedSockets.push(userClient)
        }
        else if (user.aud === "deliveryman") {
            const lngLat = socket.handshake.query.coords
            if (!lngLat) {
                socket.disconnect()
                throw new ForbiddenException({
                    message: "coordinates not present"
                })
            }
            if (typeof lngLat === "string") {
                const lngLatArr = lngLat.split(",")
                socket.join(this.deliverymanRoom)
                const userClient = {
                    socketId: socket.id,
                    userId: user.sub,
                    role: user.aud,
                    room: this.deliverymanRoom,
                    lngLat: lngLatArr
                }
                this.connectedSockets.push(userClient)
            }
        }
        else {
            socket.disconnect()
        }
        
        console.log("connected sockets: ", this.connectedSockets)
    }

    @SubscribeMessage('new-order')
    async handleNewOrder(@MessageBody() newOrderDto: NewOrderDTO) {
        const newOrder = await this.orderService.createNewOrder(newOrderDto)

        const shopsWithProductsPromise = newOrder.productList.map(async (productsOfAShop) => {
            const shopDoc = await this.shopModel.findById(productsOfAShop.shopId)
            if (!shopDoc) {
                throw new BadRequestException(`${productsOfAShop.shopId} Shop not exist`)
            }
            
            let total: number = 0;
            productsOfAShop.products.forEach(prod => {
                total += prod.price * prod.quantity
            })
            return {
                products: productsOfAShop,
                total: total,
                id: shopDoc["_id"],
                name: shopDoc.name,
                coordinates: shopDoc.location.coordinates,
                openingHour: shopDoc.openingHour,
                closingHour: shopDoc.closingHour,
                category: shopDoc.shopCategory
            }
        })

        const shopsWithProducts = await Promise.all(shopsWithProductsPromise)

        const deliverymen = this.connectedSockets.filter(client => {
            if (client.role === "deliveryman") {
                return client
            }
        })

        if (deliverymen.length === 0) {
            throw new Error("NO DELIVERY MAN ")
        }
        
        const deliveryManDistances = deliverymen.map(deliveryman => {
            const [lng, lat] = newOrder.deliveryLocation.coordinates
            const orderDistanceFromDeliveryMan = this.locationService.calculateDistance(
                lat, lng, deliveryman.lngLat[1], deliveryman.lngLat[0]
            )

            const shopDistancesFromDeliveryMan = shopsWithProducts.map(shop => {
                const distance = this.locationService.calculateDistance(
                    deliveryman.lngLat[1],
                    deliveryman.lngLat[0],
                    shop.coordinates[1],
                    shop.coordinates[0]
                )
                return distance
            })

            const totalShopDistances = shopDistancesFromDeliveryMan.reduce((prevValue, currValue) => prevValue + currValue)

            const totalDistance = totalShopDistances + orderDistanceFromDeliveryMan

            return {
                deliveryman: deliveryman,
                totalDistance: totalDistance
            }
        })

        this.shortAsending(deliveryManDistances)
        const updatedOrder = await this.orderService.updateAnOrder(newOrder["_id"], {
            deliveryMan: deliveryManDistances[0].deliveryman.userId
        })

        console.log(updatedOrder)

        shopsWithProducts.forEach(shop => {
            this.connectedSockets.forEach(client => {
                if (client.shopId == shop.id) {
                    const orderDataForShop = {
                        id: newOrder["_id"],
                        customerName: newOrder.customerName,
                        total: shop.total,
                        deliveryStatus: newOrder.deliveryStatus,
                        time: newOrder.createdAt,
                        products: shop.products,
                        deliveryMan: updatedOrder?.deliveryMan
                    }
                    this.wsServer.sockets.in(client.socketId).emit('new-order', orderDataForShop)
                }
            })
        })

        // const deliverymen = this.connectedSockets.filter(client => {
        //     if (client.role === "deliveryman") {
        //         return client
        //     }
        // })

        // if (deliverymen.length === 0) {
        //     throw new Error("NO DELIVERY MAN ")
        // }
        
        // const deliveryManDistances = deliverymen.map(deliveryman => {
        //     const [lng, lat] = newOrder.deliveryLocation.coordinates
        //     const orderDistanceFromDeliveryMan = this.locationService.calculateDistance(
        //         lat, lng, deliveryman.lngLat[1], deliveryman.lngLat[0]
        //     )

        //     const shopDistancesFromDeliveryMan = shopsWithProducts.map(shop => {
        //         const distance = this.locationService.calculateDistance(
        //             deliveryman.lngLat[1],
        //             deliveryman.lngLat[0],
        //             shop.coordinates[1],
        //             shop.coordinates[0]
        //         )
        //         return distance
        //     })

        //     const totalShopDistances = shopDistancesFromDeliveryMan.reduce((prevValue, currValue) => prevValue + currValue)

        //     const totalDistance = totalShopDistances + orderDistanceFromDeliveryMan

        //     return {
        //         deliveryman: deliveryman,
        //         totalDistance: totalDistance
        //     }
        // })

        const orderDataForDeliveryMan = {
            id: newOrder["_id"],
            customerName: newOrder.customerName,
            time: newOrder.createdAt,
            products: shopsWithProducts,
            total: newOrder.total,
            deliveryStatus: newOrder.deliveryStatus
        }
        this.wsServer.sockets.in(deliveryManDistances[0].deliveryman.socketId)
            .emit('new-order', orderDataForDeliveryMan)
    }

    @SubscribeMessage("status-change-shop")
    changeDeliveryStatus(@MessageBody() data: DeliveryStatusChangeDTO) {
        const deliveryMan = this.connectedSockets.find(client => client.userId == data.deliveryMan)
        this.wsServer.sockets.in(deliveryMan.socketId).emit("delivery-status-change", {
            id: data.id,
            shopId: data.shopId,
            changeTo: data.changeTo
        })
    }

    private shortAsending(arr: Array<{deliveryman: any,totalDistance: number}>) {
        for (let i = 0; i < arr.length - 1; i++) {
            let isSwapped = false
            for (let j = 0; j < arr.length - i - 1; j++) {
                if (arr[j].totalDistance > arr[j + 1].totalDistance) {
                    let temp = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = temp
                    isSwapped = true
                }
            }
            if (!isSwapped) {
                break
            }
        }
    }

}