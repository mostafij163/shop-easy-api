import { Injectable, Scope, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ClothAndShoeDTO } from '../../dto/clothAndShoe.dto';
import { ClothAndShoe, ClothAndShoeDocument } from '../../schemas/productSchemas/clothAndShoe.schema';
import { ProductService } from './product.service';

@Injectable({scope: Scope.REQUEST})
export class ClothAndShoeService extends ProductService{
    constructor(@InjectModel(ClothAndShoe.name) protected ProductModel: mongoose.Model<ClothAndShoeDocument>) {
        super(ProductModel)
    }

    // filterByCategory(subCategory: string | undefined) {
    //     if (subCategory) this.query = this.query.find({ subCategory })
    //     return this;
    // }

    filterBySize(size: string | undefined) {
        if (size) this.query = this.query.find({ availableSize: size})
        return this;
    }
}