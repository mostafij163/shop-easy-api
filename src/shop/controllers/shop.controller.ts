import {
    Body,
    Controller,
    Post,
    Delete,
    Param,
    Headers,
    Query,
    Get,
    Req,
    HttpException,
    InternalServerErrorException,
    HttpCode,
    ForbiddenException,
    BadRequestException,
    NotFoundException,
    HttpStatus,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { Request } from 'express';
import { ClothAndShoeDTO } from '../dto/clothAndShoe.dto';
import { NewShopDTO } from '../dto/newShop.dto';
import { FilterQueryDTO } from '../dto/filterQueryDto';
import { ShopDocument } from '../schemas/shop.schema';
import { ShopService } from '../services/shop.service';
import { UpdateQueryDTO } from '../dto/updateProdQuery';
import { JwtAuthGuard } from 'src/authentication/guards/jwtAuth.guard';

@Controller('shop')
export class ShopController {
    constructor(private readonly shopService: ShopService) { }

    @UseGuards(JwtAuthGuard)
    @Post('new-shop')
    async createShop(@Body() newShop: NewShopDTO): Promise<string> {
        return await this.shopService.createShop(newShop);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('product/:productId')
    async deleteProduct(
        @Param('productId') productId: string,
        @Headers('x-shop-jwt') shopJwt: string
    ) {
        const token = shopJwt.split(' ')[1]
        return await this.shopService.deleteProduct(productId, token)
    }

    @UseGuards(JwtAuthGuard)
    @Patch('product/:productId')
    async updateProduct(
        @Param('productId') productId: string,
        @Headers('x-shop-jwt') shopJwt: string,
        @Body() query: UpdateQueryDTO) {
        const token = shopJwt.split(' ')[1]
        return await this.shopService.updateProduct(productId, token, query)
    }

    @UseGuards(JwtAuthGuard)
    @Get('product')
    async getAllProducts(@Headers('x-shop-jwt') shopJwt: string) {
        const token = shopJwt.split(' ')
        return await this.shopService.getAllProducts(token[1]);
    }

    @UseGuards(JwtAuthGuard)
    @Post('product')
    addNewProduct(@Body() product: any,
        @Headers("x-shop-jwt") shopJwt: string) {
        const token = shopJwt.split(' ');
        return this.shopService.createProduct(product, token[1])
    }

    @Get('filter-products/:shopId/:shopCategory')
    async filterProduct(
        @Param('shopId') shopId: string,
        @Param('shopCategory') category: string,
        @Query() filterQueryDto: FilterQueryDTO,
    ) {
        return await this.shopService.getFilteredProducts(category, shopId, filterQueryDto)
    }

    @Get('near-me')
    async findShopNearMe(@Query() query: { coords: string, categories: string }) {
        const lngLat = query.coords.split(',').map(num => Number(num))
        const shopCategories = query.categories.split(',')
        return await this.shopService.findShopNearMe(lngLat, shopCategories)
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-shops')
    async getAllShop(@Req() req: Request) {
        const user: any = req.user
        if (user) {
            return await this.shopService.getMyShops(user.id)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('login/:shopId')
    async login(
        @Headers('Authorization') auth: string,
        @Param('shopId') id: string,
        @Req() req: Request
    ) {
        return await this.shopService.getAShopWithJWT(id)
    }

    @Get(':shopId')
    async getAShop(@Param('shopId') shopId: string) {
        return await this.shopService.getAShop(shopId)
    }

}
