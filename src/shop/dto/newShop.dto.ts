
import {
    IsDate,
    IsNotEmpty,
    IsString
} from "class-validator";
import { Types } from "mongoose"
import { Location } from "../../location/schemas/location.schema";
import { shopCategory } from "../utils/shopCategory.enum";

export class NewShopDTO{
    @IsString()
    name!: string;
    // owner: Types.ObjectId;
    location!: Location;
    @IsNotEmpty()
    shopCategory!: shopCategory;
    description?: string;
    @IsNotEmpty()
    openingHour!: string;
    @IsNotEmpty()
    closingHour!: string;
}