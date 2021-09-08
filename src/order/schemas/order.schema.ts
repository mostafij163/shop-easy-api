import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { LocationSchema, Location } from "../../location/schemas/location.schema";
import { ProductList, productListSchema } from "./productList.schema";

export type OrderDocument = Order & mongoose.Document;

@Schema({
    timestamps: true
})
export class Order {
    @Prop({
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'Customer'
    })
    customer!: mongoose.Types.ObjectId

    @Prop({
        required: true,
    })
    customerName!: string

    @Prop({
        required: true,
        type: [productListSchema]
    })
    productList!: ProductList[]

    @Prop({
        required: true,
        type: LocationSchema
    })
    deliveryLocation!: Location
    
    @Prop({
        required: true
    })
    total!: number
    @Prop({
        required: true,
        default: "pending",
        enum: ["pending", "delivered", "reached"]
    })
    deliveryStatus!: string
    @Prop({
        types: mongoose.Types.ObjectId
    })
    deliveryMan?: mongoose.Types.ObjectId
    createdAt!: mongoose.Date
}

export const orderSchema = SchemaFactory.createForClass(Order);