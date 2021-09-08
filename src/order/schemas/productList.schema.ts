import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose"
import { products } from "../utils/productList.type";

@Schema({ _id: false })
export class Products extends mongoose.Document {
    @Prop({
        required: true
    })
    productId!: mongoose.Types.ObjectId;

    @Prop({
        required: true
    })
    title!: string;

    @Prop({
        required: true
    })
    price!: number;

    @Prop({
        required: true
    })
    quantity!: number;
}

const productSchema = SchemaFactory.createForClass(Products)

@Schema({_id: false})
export class ProductList extends mongoose.Document{

    @Prop({
        required: true,
        default: "pending",
        enum: ["pending", "delivered", "reached"]
    })
    deliveryStatus!: string

    @Prop({required: true})
    shopId!: mongoose.Types.ObjectId

    @Prop({
        required: true,
        type: [productSchema]
    })
    products!: Products[]
}

export const productListSchema = SchemaFactory.createForClass(ProductList)