import { DynamicModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ClothAndShoe, clothAndShoeSchema } from "../schemas/productSchemas/clothAndShoe.schema";
import { Medicine, medicineSchema } from "../schemas/productSchemas/medicine.schema";
import { Shop, ShopSchema } from "../schemas/shop.schema";

export const registeredSchemas: DynamicModule = MongooseModule.forFeature([
    {
        name: Shop.name,
        schema: ShopSchema,
    },
    {
        name: ClothAndShoe.name,
        schema: clothAndShoeSchema,
    },
    {
        name: Medicine.name,
        schema: medicineSchema
    },
])