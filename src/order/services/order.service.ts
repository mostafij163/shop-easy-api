import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ShopService } from "../../shop/services/shop.service";
import { NewOrderDTO } from "../dto/newOrder.dto";
import { UpdateOrder } from "../dto/updateOrder.dto";
import {Order, OrderDocument } from "../schemas/order.schema";

@Injectable()
export class OrderService {
    constructor(
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
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

    async updateAnOrder(orderId: string, updateQuery: UpdateOrder) {
        try {
            return await this.orderModel.findByIdAndUpdate(orderId, updateQuery, {new: true})
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async getAShopOrders(shopId: string) {
        try {
            return this.orderModel.aggregate([
                {
                    $match: {"productList.shop": shopId}
                },
                {
                    $unwind: "$productList"
                },
                { $match: { "productList.shop": shopId } },
                {
                    $group: {
                        _id: "$_id",
                        productList: { $push: "$productList" }
                    }
                }
            ])
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }
}