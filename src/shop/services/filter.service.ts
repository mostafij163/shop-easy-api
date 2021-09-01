import { Injectable, Scope } from "@nestjs/common";
import { FilterQueryDTO } from "../dto/filterQueryDto";
import { ClothAndShoeService } from "./productServices/clothAndShoe.service";
import { MedicineService } from "./productServices/medicine.service";

@Injectable({ scope: Scope.REQUEST })
export class FilterService {
    constructor(
        private clothandshoeService: ClothAndShoeService,
        private medicineService: MedicineService,
    ) { }
    
    private clothAndShoe(shopId: string, query: FilterQueryDTO) {
        return this.clothandshoeService
            .getAll(shopId)
            .filterByCategory(query.category)
            .filterByManufacturer(query.manufacturer)
            .filterBySize(query.availableSize)
            .sort(query.sort)
            .query
    }

    private medicine(shopId: string, query: FilterQueryDTO) {
        return this.medicineService
            .getAll(shopId)
            .filterByCategory(query.category)
            .filterByManufacturer(query.manufacturer)
            .sort(query.sort)
            .query
    }

    getFilter(shopCategory: string, shopId: string, query: FilterQueryDTO) {
        if (shopCategory === "CLOTHANDSHOE") {
            return this.clothAndShoe(shopId, query)
        } else if (shopCategory === "MEDICINE") {
            return this.medicine(shopId, query)
        }
    }
}