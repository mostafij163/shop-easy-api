import { Injectable, Scope, } from "@nestjs/common";
import { shopCategory } from "../utils/shopCategory.enum";
import { ClothAndShoeService } from "./productServices/clothAndShoe.service";
import { MedicineService } from "./productServices/medicine.service";
import { ProductService } from "./productServices/product.service";

@Injectable({scope: Scope.REQUEST})
export class ProductFactoryService {
    constructor(
        private clothAndShoeService: ClothAndShoeService,
        private medicineService: MedicineService,
    ) { }

    getProductService(category: string): ProductService {
        switch (category) {
            case shopCategory.CLOTHANDSHOE: category
                return this.clothAndShoeService
            case shopCategory.MEDICINE: category
                return this.medicineService
            default:
                throw new Error("shop category not found");
                break;
        }
    }
}