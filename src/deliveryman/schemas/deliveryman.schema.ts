import { Schema, Prop, SchemaFactory, } from "@nestjs/mongoose";
import { CommonUsers } from "src/utils/mongoose/usersCommon";
import { comparePassword } from "src/utils/mongoose/comparePassword";
import { hashPassword } from "src/utils/mongoose/hashPassword";
import { generateRandomToken } from "src/utils/mongoose/randomToken";

@Schema({
    timestamps: true
})
export class DeliveryMan extends CommonUsers{
    @Prop({
        required: true,
        unique: true,
        index: true
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
    @Prop({
        required: true,
        unique: true,
        index: true
    })
    nid!: string
    @Prop({
        default: false,
        select: false
    })
    activeStatus!: boolean
    @Prop({
        default: 'deliveryman',
        enum: ['deliveryman']
    })
    role!: string
    @Prop()
    token?: string
    @Prop()
    tokenExp?: number

    generateRandomToken!: Function;
    comparePassword!: Function;
}

export const deliverymanSchema = SchemaFactory.createForClass(DeliveryMan);
// DeliveryManSchema.index({ email: 1 }, {unique: true});
hashPassword<DeliveryMan>(deliverymanSchema)
comparePassword<DeliveryMan>(deliverymanSchema);
generateRandomToken<DeliveryMan>(deliverymanSchema);

