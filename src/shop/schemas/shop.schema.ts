import {
    Prop,
    Schema,
    SchemaFactory,

} from '@nestjs/mongoose';
import {Types, SchemaTypes, Document} from 'mongoose';
import { shopCategory } from '../utils/shopCategory.enum';
import { Location, LocationSchema } from './../../location/schemas/location.schema';
import { Seller } from 'src/seller/schemas/seller.schema';

export type ShopDocument = Shop & Document

@Schema({
    timestamps: true
})
export class Shop {
    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop({
        required: true,
        type: SchemaTypes.ObjectId,
        ref: 'Seller'
    })
    owner!: Types.ObjectId

    @Prop({
        required: true,
        type: LocationSchema
    })
    location!: Location;

    @Prop({
        required: true,
        enum: shopCategory
    })
    shopCategory!: string;

    // @Prop({
    //     type: mongoose.Schema.Types.ObjectId,
    // })
    // products?: string[]

    @Prop()
    description?: string

    @Prop({
        required: true,
    })
    openingHour!: string

    @Prop({
        required: true,
    })
    closingHour!: string

    @Prop({
        default: false,
        select: false
    })
    activeStatus!: boolean
}

export const ShopSchema = SchemaFactory.createForClass(Shop);