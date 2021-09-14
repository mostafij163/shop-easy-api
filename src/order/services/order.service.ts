import { BadRequestException, Injectable, InternalServerErrorException, Req, UseGuards } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShopService } from "../../shop/services/shop.service";
import { NewOrderDTO } from "../dto/newOrder.dto";
import { UpdateOrder } from "../dto/updateOrder.dto";
import { Order, OrderDocument } from "../schemas/order.schema";
import { Shop, ShopDocument } from "../../shop/schemas/shop.schema"
import { JwtAuthGuard } from "../../authentication/guards/jwtAuth.guard";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Shop.name) private shopModel: Model<ShopDocument>,
    ) { }
    
    async createNewOrder(newOrderDto: NewOrderDTO) {
        try {
            const newOrder = await this.orderModel.create(newOrderDto)
            return newOrder
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getMyShopOrders(shopId: string) {
        try {
            return await this.orderModel.find({})
        } catch (err:any) {
            
        }
    }

    async updateShopOrderStatus(orderId: string, shopId: string, status: string) {
        try {
            return this.orderModel.updateOne({_id: orderId, "productList.shopId": shopId}, {$set: {"productList.$.deliveryStatus": status}})
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async updateAnOrder(orderId: string, updateQuery: UpdateOrder) {
        try {
            return await this.orderModel.findByIdAndUpdate(orderId, updateQuery, {new: true})
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getAShopOrders(shopId: string) {
        try {
            return await this.orderModel.aggregate([
                {
                    $match: {"productList.shopId": shopId}
                },
                {
                    $unwind: "$productList"
                },
                { $match: { "productList.shopId": shopId } },
                {
                    $group: {
                        _id: "$_id",
                        products: { $push: "$productList" },
                        customer: { $first: "$customer" },
                        customerName: { $first: "$customerName" },
                        deliveryLocation: { $first: "$deliveryLocation" },
                        time: { $first: "$createdAt" },
                        deliveryMan: {$first: "$deliveryMan"}
                    }
                }
            ])
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getADeliveryManOrders(id: string) {
        try {
            const orders = await this.orderModel.find({ deliveryMan: `${id}` })
                const ordersPromise = orders.map(async order => {
                    const shopsWithProductsPromise = order.productList.map(async productsOfAShop => {
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
                    const shopsWithProducts = await Promise.all(shopsWithProductsPromise);

                    const orderDataForDeliveryMan = {
                        id: order["_id"],
                        customerName: order.customerName,
                        time: order.createdAt,
                        products: shopsWithProducts,
                        total: order.total,
                        deliveryStatus: order.deliveryStatus
                    }

                    return orderDataForDeliveryMan
                })
            
            const ordersDoc = await Promise.all(ordersPromise)
            return ordersDoc
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getMyOrders(customer: string) {
        console.log(customer)
        try {
            const data = await this.orderModel.find({ customer: `${customer}` })
            const products = data.map(order => {
                const d = order.productList.map(shopWithProducts => shopWithProducts.products)
                const flattendProducts = d.flat(2)

                return {
                    customer: order.customer,
                    id: order["_id"],
                    products: flattendProducts,
                    total: order.total,
                    time: order.createdAt,
                    deliveryMan: order.deliveryMan,
                    deliveryStatus: order.deliveryStatus
                }
            })
            return products
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}