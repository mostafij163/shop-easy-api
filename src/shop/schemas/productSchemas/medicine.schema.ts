import { Schema, Prop, SchemaFactory, } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Shop } from "../shop.schema";

export type MedicineDocument = Medicine & mongoose.Document;

@Schema()
export class Medicine {
    @Prop({
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    })
    shop!: Shop
    @Prop({
        required: true,
        unique: true,
    })
    title!: string
    @Prop({
        required: true,
    })
    price!: number
    @Prop({
        required: true,
        trim: true
    })
    category!: string
    @Prop()
    manufacturer?: string
    @Prop()
    description?: string
}

export const medicineSchema = SchemaFactory.createForClass(Medicine);
