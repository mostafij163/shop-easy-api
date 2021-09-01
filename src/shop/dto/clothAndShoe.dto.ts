import { IsNotEmpty, isNumber, IsNumber } from "class-validator";
import { clothAndShoeProductCategory } from "../utils/productCategory.enum";
import { ProductDTO } from "./productDto.interface";

export class ClothAndShoeDTO implements ProductDTO {
    @IsNotEmpty()
    shop!: string
    @IsNotEmpty()
    title!: string
    @IsNotEmpty()
    category!: clothAndShoeProductCategory
    @IsNumber()
    price!: number
    @IsNumber()
    weight?: number
    manufacturer?: string
    description?: string
    availableSize?: Array<string>
    color?: Array<string>
}