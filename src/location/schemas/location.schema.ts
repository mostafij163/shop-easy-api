import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type LocationDocument = Location & mongoose.Document;

@Schema({_id: false})
export class Location{
    @Prop({
        default: "Point",
        enum: ["Point"],
    })
    type!: String
    @Prop()
    coordinates!: [number, number]
}

export const LocationSchema = SchemaFactory.createForClass(Location);