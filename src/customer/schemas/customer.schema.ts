import { Schema, Prop, SchemaFactory, } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { CommonUsers } from "src/utils/mongoose/usersCommon";
import { comparePassword } from "src/utils/mongoose/comparePassword";
import { hashPassword } from "src/utils/mongoose/hashPassword";
import { generateRandomToken } from "src/utils/mongoose/randomToken";
import * as crypto from "crypto"

@Schema({
    timestamps: true
})
export class Customer extends CommonUsers{
    @Prop({
        required: true,
    })
    email!: string;
    @Prop({
        required: true,
    })
    name!: string
    @Prop({
        required: true,
        select: false,
        minlength: [6, "Minumum lenth for password 6 charecter"]
    })
    password!: string
    // @Prop({
    //     required: true
    // })
    // confirmPassword?: string
    @Prop({
        default: false,
        select: false
    })
    activeStatus!: boolean
    @Prop({
        default: 'customer',
        enum: ['customer']
    })
    role!: string
    @Prop()
    token?: string
    @Prop()
    tokenExp?: number

    generateRandomToken!: Function;
    comparePassword!: Function;
}

export const customerSchema = SchemaFactory.createForClass(Customer);
// customerSchema.index({ email: 1 }, {unique: true});
hashPassword<Customer>(customerSchema)
comparePassword<Customer>(customerSchema);
generateRandomToken<Customer>(customerSchema);