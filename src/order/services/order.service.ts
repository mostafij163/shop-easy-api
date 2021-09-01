import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NewOrderDTO } from "../dto/newOrder.dto";
import {Order, OrderDocument } from "../schemas/order.schema";

@Injectable()
export class OrderService {
    constructor(@InjectModel(Order.name) private orderModel: Model<OrderDocument>) { }
    
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
}