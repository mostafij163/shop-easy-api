/* eslint-disable prettier/prettier */
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from "@nestjs/common"
import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { io } from "socket.io-client"
import { JWTService } from "../../authentication/services/jwt.service"
import { NewOrderDTO } from "../dto/newOrder.dto"
import { OrderService } from "./order.service"

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
        private jwtService: JWTService,
        private orderService: OrderService
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

    handleConnection(socket: Socket, data: any) {
        try {
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
                    const shop: any = this.jwtService.verifyToken(shopJwt)
                    socket.join(this.sellerRoom)
                    const userClient = {
                        socketId: socket.id,
                        userId: user.sub,
                        shopId: shop.sub,
                        room: this.sellerRoom
                    }
                    this.connectedSockets.push(userClient)
                }
                console.log(socket.rooms)
            }
            else if (user.aud === "admin") {
                socket.join(this.adminRoom)
                const userClient = {
                    socketId: socket.id,
                    userId: user.sub,
                    room: this.adminRoom
                }
                this.connectedSockets.push(userClient)
            }
            else if (user.aud === "deliveryman") {
                socket.join(this.deliverymanRoom)
                const userClient = {
                    socketId: socket.id,
                    userId: user.sub,
                    room: this.deliverymanRoom
                }
                this.connectedSockets.push(userClient)
            }
            else {
                socket.disconnect()
            }
            
            console.log("connected sockets: ", this.connectedSockets)
        } catch (err) {
            throw new WsException('Invalid Credential')
        }
    }

    @SubscribeMessage('new-order')
    async handleNewOrder(@MessageBody() newOrderDto: NewOrderDTO) {
        const newOrder = await this.orderService.createNewOrder(newOrderDto)
        try {
            const shops = newOrder.productList.map(product => product.shop)
            const shopsArrUnique = Array.from(new Set(shops))
            const shopsWithProducts = shopsArrUnique.map(shopId => {
                const products = newOrder.productList.filter(product => {
                    if(product.shop === shopId) return product
                })
                return {
                    [shopId]: products
                }
            })

            shopsWithProducts.forEach(shop => {
                const shopId = Object.keys(shop)[0]
                this.connectedSockets.forEach(client => {
                    if (client.shopId === shopId) {
                        let total: number = 0;
                        shop[shopId].forEach(prod => {
                            total += prod.price * prod.quantity
                        })
                        console.log(total)
                        const orderDataForShop = {
                            id: newOrder["_id"],
                            customerName: newOrder.customerName,
                            total: total,
                            deliveryStatus: newOrder.deliveryStatus,
                            time: newOrder.createdAt,
                            products:shop[shopId]
                        }
                        this.wsServer.sockets.in(client.socketId).emit('new-order', orderDataForShop)
                    }
                })
            })
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

}