import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException, Scope, } from '@nestjs/common';
import { InjectModel, } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { NewShopDTO } from '../dto/newShop.dto';
import { FilterQueryDTO } from '../dto/filterQueryDto';
import { Shop, ShopDocument } from '../schemas/shop.schema';
import { ClothAndShoeService } from './productServices/clothAndShoe.service';
import { MedicineService } from './productServices/medicine.service';
import { UpdateQueryDTO } from '../dto/updateProdQuery';
import { FilterService } from './filter.service';
import { JWTService } from '../../authentication/services/jwt.service';

@Injectable()
export class ShopService {
    constructor(
        @InjectModel(Shop.name) private readonly ShopModel: mongoose.Model<ShopDocument>,
        private clothandshoeService: ClothAndShoeService,
        private medicineService: MedicineService,
        private filterService: FilterService,
        private jwtService: JWTService,
    ) {}

    async createShop(newShopDto: NewShopDTO): Promise<string> {
        let newShop: ShopDocument
        try {
            newShop = await this.ShopModel.create(newShopDto);
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
        const jwtToken = this.jwtService.signToken(
            {
                ownerId: newShop.owner,
                title: newShop.name,
                category: newShop.shopCategory
            },
            {
                audience: "shop",
                subject: newShop.id,
                expiresIn: "365d",
                issuer: "shopeasy"
            }
        )

        return jwtToken;
    }

    async getAShop(shopId: string) {
        try {
            const shop = await this.ShopModel.findById(shopId);
            if (!shop) {
                return new NotFoundException({message: "Shop not found", status:HttpStatus.NOT_FOUND})
            }
            return shop;
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }
    
    async getAShopWithJWT(shopId: string) {
        try {
            const shop = await this.ShopModel.findById(shopId);
            if (!shop) {
                return new NotFoundException({message: "Shop not found", status:HttpStatus.NOT_FOUND})
            }
            const jwtToken = this.jwtService.signToken(
                {
                    ownerId: shop.owner,
                    title: shop.name,
                    category: shop.shopCategory
                },
                {
                    audience: "shop",
                    subject: shop.id,
                    expiresIn: "365d",
                    issuer: "shopeasy"
                }    
            )
            return {shop, jwt: jwtToken}
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async getMyShops(ownerId: string): Promise<ShopDocument[]> {
        const ownerObjectId = new mongoose.Types.ObjectId(ownerId)
        try {
            return await this.ShopModel.find({owner: ownerObjectId});
        } catch (err) {
           throw new InternalServerErrorException(err) 
        }
    }

    async findShopNearMe(coords: Array<Number>, categories: Array<string>) {
        const catQueryArr = categories.map(cat => {
            return {
                shopCategory: cat
            }
        })
        try {
            return await this.ShopModel.find(
                {
                    location: { $near: { $geometry: { type: "Point", coordinates: coords }, $maxDistance: 10000 } },
                    $or: catQueryArr
                }
            )
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async updateProduct(productId: string, jwtToken: string, query: UpdateQueryDTO) {
        const decodedShop: any = this.jwtService.verifyToken(jwtToken,{
            audience: "shop"
        });
        if (decodedShop.category === "MEDICINE") {
            return await this.medicineService.update(productId, query)
        } else if (decodedShop.category === "CLOTHANDSHOE") {
            return await this.clothandshoeService.update(productId, query)
        }
    }

    async deleteProduct(productId: string, jwtToken: string) {
        const decodedShop: any = this.jwtService.verifyToken(jwtToken, {
            audience: "shop"
        });
        if (decodedShop.category === "MEDICINE") {
            await this.medicineService.delete(productId);
        } else if (decodedShop.category === "CLOTHANDSHOE") {
            await this.clothandshoeService.delete(productId)
        }
    }

    async createProduct(product: any, jwt: string) {
        const decodedToken: any = this.jwtService.verifyToken(jwt)
        try {
            if (decodedToken.category === "MEDICINE") {
                return await this.medicineService.create({
                    shop: decodedToken.sub,
                    title: product.title,
                    price: product.price,
                    category: product.category,
                    manufacturer: product.manufacturer,
                    description: product.description
                })
            } else if (decodedToken.category === "CLOTHANDSHOE") {
                return await this.clothandshoeService.create({
                    shop: decodedToken.sub,
                    title: product.title,
                    price: product.price,
                    category: product.category,
                    manufacturer: product.manufacturer,
                    description: product.description,
                    availableSize: product.availableSize,
                    color: product.color
                })
            }
        } catch (error) {
            throw new InternalServerErrorException(error)
        }
    }

    async getAllProducts(jwt: string) {
        const decodedToken: any = this.jwtService.verifyToken(jwt)
        if (decodedToken.category === "MEDICINE") {
            return await this.medicineService.getAll(decodedToken.sub).query
        } else if (decodedToken.category === "CLOTHANDSHOE") {
            return await this.clothandshoeService.getAll(decodedToken.sub).query
        }
    }

    // async getProducts(shopId: string, query: FilterQueryDTO): Promise<MedicineDocument[]>
    // async getProducts(shopId: string, query: FilterQueryDTO): Promise<ClothAndShoeDocument[]>;

    async getFilteredProducts(category: string, shopId: string, query: FilterQueryDTO) {
        return await this.filterService.getFilter(category, shopId, query)
    }
}
