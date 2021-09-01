import { Injectable, Scope } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Document, Model } from "mongoose";
import { Medicine, MedicineDocument } from "src/shop/schemas/productSchemas/medicine.schema";
import { ProductService } from "./product.service";

@Injectable({ scope: Scope.REQUEST })
export class MedicineService extends ProductService {
    constructor(@InjectModel(Medicine.name) ProductModel: Model<MedicineDocument>) {
        super(ProductModel);
    }

    // filterByCategory(category: string | undefined) {
    //     if (category) this.query = this.query.find({ category })
    //     return this
    // }
}