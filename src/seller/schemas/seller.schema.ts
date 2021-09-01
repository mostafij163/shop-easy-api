import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs"
import { Shop } from "src/shop/schemas/shop.schema";
import { CommonUsers } from "src/utils/mongoose/usersCommon";
import { hashPassword } from "src/utils/mongoose/hashPassword";
import { comparePassword } from "src/utils/mongoose/comparePassword";
import { generateRandomToken } from "src/utils/mongoose/randomToken";

@Schema({
    timestamps: true
})
export class Seller extends CommonUsers {
    @Prop({
        required: true,
        unique: true,
        index: true
    })
    email!: string
    @Prop({
        required: true,
    })
    name!: string
    @Prop({
        required: true,
    })
    nid!: number
    @Prop({
        required: true,
        minlength: 6,
        select: false,
    })
    password!: string
    @Prop({
        required: true,
        default: 'seller',
        enum: ['seller']
    })
    role!: string
    @Prop({
        required: true,
        default: false,
        select: false
    })
    activeStatus!: boolean
    @Prop()
    token?: string
    @Prop()
    tokenExp?: number

    generateRandomToken!: Function;
    comparePassword!: Function;
}

export const sellerSchema = SchemaFactory.createForClass(Seller);
hashPassword<Seller>(sellerSchema);
comparePassword<Seller>(sellerSchema)
generateRandomToken<Seller>(sellerSchema);
