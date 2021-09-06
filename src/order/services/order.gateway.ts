/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, forwardRef, Optional, UnauthorizedException } from "@nestjs/common"
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { NewOrderDTO } from "../dto/newOrder.dto"
import { OrderService } from "./order.service"
import { JWTService } from "../../authentication/services/jwt.service"
// import { ShopService } from "../../shop/services/shop.service"
import { Shop, ShopDocument } from "../../shop/schemas/shop.schema"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { LocationService } from "../../location/services/location.service"

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
        const shops = newOrder.productList.map(product => product.shop)
        const shopsArrUnique = Array.from(new Set(shops))
        const shopsWithProductsPromise = shopsArrUnique.map(async (shopId) => {
            const shop = await this.shopModel.findById(shopId)
            if (!shop) {
                throw new BadRequestException(`${shopId} Shop not exist`)
            }
            const products = newOrder.productList.filter(product => {
                if(product.shop === shopId) return product
            })
            return {
                products: products,
                id: shop["_id"],
                name: shop.name,
                coordinates: shop.location.coordinates,
                openingHour: shop.openingHour,
                closingHour: shop.closingHour,
                category: shop.shopCategory
            }
        })

        const shopsWithProducts = await Promise.all(shopsWithProductsPromise)

        shopsWithProducts.forEach(shop => {
            this.connectedSockets.forEach(client => {
                if (client.shopId == shop.id) {
                    let total: number = 0;
                    shop.products.forEach(prod => {
                        total += prod.price * prod.quantity
                    })
                    const orderDataForShop = {
                        id: newOrder["_id"],
                        customerName: newOrder.customerName,
                        total: total,
                        deliveryStatus: newOrder.deliveryStatus,
                        time: newOrder.createdAt,
                        products:shop.products
                    }
                    this.wsServer.sockets.in(client.socketId).emit('new-order', orderDataForShop)
                }
            })
        })

        const deliverymen = this.connectedSockets.filter(client => {
            if (client.role === "deliveryman") {
                return client
            }
        })

        // const orderShopsPromise = shopsArrUnique.map(async (shopId) => {
        //     const shop = await this.shopModel.findById(shopId)
        //     if (shop) {
        //         return shop
        //     } else {
        //         throw new BadRequestException(`${shopId} Shop not exist`)
        //     }
        // })
        // Promise.all(orderShopsPromise).then(shops => {
        
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
                    return {
                        id: shop.id,
                        name: shop.name,
                        distance: distance,
                        lngLat: shop.coordinates
                    }
                })

                const distances = shopDistancesFromDeliveryMan.map(val => val.distance)
                const totalShopDistances = distances.reduce((prevValue, currValue) => prevValue + currValue)

                return totalShopDistances + orderDistanceFromDeliveryMan
            })
        
        // })
    }

}