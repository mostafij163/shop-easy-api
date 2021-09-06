import {
    BadRequestException,
    Body,
    Controller,
    ForbiddenException,
    Get,
    Headers,
    InternalServerErrorException,
    Post,
    Req,
    UseGuards
} from "@nestjs/common";
import { OrderGateway } from "./services/order.gateway";
import { NewOrderDTO } from "./dto/newOrder.dto";
import { JwtAuthGuard } from "../authentication/guards/jwtAuth.guard";
import { Request } from "express";
import * as jwtService from "jsonwebtoken"

@Controller('order')
export class OrderController {
    private jwtToken: string
    constructor(
        private orderGateway: OrderGateway,
    ) {
        const token = process.env.JWT_SECRET
        if (token) this.jwtToken = token
        else throw new Error('JWT SECRET NOT FOUND')
    }
    
    @UseGuards(JwtAuthGuard)
    @Post('new-order')
    async newOrder(@Body() newOrderDto: NewOrderDTO) {
        try {
           return await this.orderGateway.handleNewOrder(newOrderDto)
        } catch (err) {
           throw new InternalServerErrorException(err) 
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('shop-orders')
    async getMyShopOrders(@Req() req: Request, @Headers('x-shop-jwt') shopToken: string) {
        const shopJwt = shopToken.split(" ")[1]
        const decodedShop = jwtService.verify(shopJwt, this.jwtToken, {
            audience: "shop",
        })
        const user: any = req.user
        if (user.role === "seller") {
            
        } else {
            throw new ForbiddenException()
        }
    }
}