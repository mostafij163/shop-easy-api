import { Body, Controller, Param, Post, } from '@nestjs/common';
import { ClothAndShoeDTO } from '../dto/clothAndShoe.dto';
import { ClothAndShoeService } from '../services/productServices/clothAndShoe.service';

@Controller('shop/cloth-and-shoe')
export class ClothAndShoeController {
    constructor(
        private clothAndShoeService: ClothAndShoeService
    ) { }
    
    @Post('add-new-product')
    addNewProduct(
        @Body() clothandshoeDTO: ClothAndShoeDTO,
    ) {
       return this.clothAndShoeService.create(clothandshoeDTO);
    }
}