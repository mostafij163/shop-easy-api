import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Shop } from 'src/shop/schemas/shop.schema';
import { clothAndShoeProductCategory } from '../../utils/productCategory.enum';

export type ClothAndShoeDocument = ClothAndShoe & mongoose.Document;

@Schema({
    timestamps: true,
})
export class ClothAndShoe {
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
        trim: true,
        required: true
    })
    category!: string

    @Prop({
        required: true,
    })
    price!: number

    @Prop()
    manufacturer?: string

    @Prop()
    weight?: number

    @Prop([String])
    availableSize?: string[]

    @Prop()
    description?: string

    @Prop([String])
    color?: string[]
}

export const clothAndShoeSchema = SchemaFactory.createForClass(ClothAndShoe);
clothAndShoeSchema.index({ shop: 1, title: 1 });