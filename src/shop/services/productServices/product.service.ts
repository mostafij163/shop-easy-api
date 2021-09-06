import * as mongoose from "mongoose"
import { ClothAndShoeDTO } from "src/shop/dto/clothAndShoe.dto";
import { MedicineDTO } from "src/shop/dto/medicine.dto";
import { FilterQueryDTO } from "src/shop/dto/filterQueryDto";
import { ClothAndShoeDocument } from "src/shop/schemas/productSchemas/clothAndShoe.schema";
import { MedicineDocument } from "src/shop/schemas/productSchemas/medicine.schema";
import { UpdateQueryDTO } from "src/shop/dto/updateProdQuery";
import {InternalServerErrorException } from "@nestjs/common";

export abstract class ProductService {
    protected ProductModel: mongoose.Model<any>
    public query: mongoose.Query<any, any>
    constructor(ProductModel: mongoose.Model<any>) {
        this.ProductModel = ProductModel;
        this.query = ProductModel.find();
    }
    
    async create(medicineDto: MedicineDTO): Promise<MedicineDocument>
    async create(clothandshoeDto: ClothAndShoeDTO): Promise<ClothAndShoeDocument>
    async create(productDto: any) {
        return await this.ProductModel.create(productDto);
    }

    async update(productId: string, query: UpdateQueryDTO) {
        let filter: UpdateQueryDTO = {}
        if (query.title) {
            filter.title = query.title
        }
        if (query.price) {
            filter.price = query.price
        }
        if (query.description) {
            filter.description = query.description
        }
        if (query.availableSize) {
            filter.availableSize = query.availableSize
        }
        if (query.category) {
            filter.category = query.category
        }
        if (query.color) {
            filter.color = query.color
        }
        try {
            return await this.ProductModel.findByIdAndUpdate(productId, filter, {new: true})
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
        
    }

    async delete(id: string) {
        try {
            await this.ProductModel.findByIdAndDelete(id)
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }

    // async getAllProductOfAShop(shopId: string): Promise<MedicineDocument[]>
    // async getAllProductOfAShop(shopId: string): Promise<ClothAndShoeDocument[]>;
     getAll(shopId: string) {
        this.query = this.query.find({ shop: shopId });
        return this;
    }

    filterByCategory(category: string | undefined) {
        if (category) this.query = this.query.find({ category })
        return this
    }

    filterByManufacturer(manufacturer: string | undefined) {
        if (manufacturer) this.query = this.query.find({ manufacturer })
        return this
    }

    sort(sort: string | undefined) {
        if (sort) this.query = this.query.sort(`${sort}`)
        return this;
    }

}