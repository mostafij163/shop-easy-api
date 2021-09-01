import { IsNotEmpty, IsNumber } from "class-validator";
import { ProductDTO } from "./productDto.interface";

export class MedicineDTO implements ProductDTO {
    @IsNotEmpty()
    shop!: string
    @IsNotEmpty()
    title!: string
    @IsNumber()
    price!: number
    category!: string[]
    manufacturer?: string
    description?: string
}