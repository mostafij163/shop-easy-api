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
import { JWTService } from "../authentication/services/jwt.service";
import { OrderService } from "./services/order.service";

@Controller('order')
export class OrderController {
    constructor(
        private orderGateway: OrderGateway,
        private jwtService: JWTService,
        private orderService: OrderService
    ) {}
    
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
        const decodedShop = this.jwtService.verifyToken(shopJwt, {
            audience: "shop",
        })
        const user: any = req.user
        if (user.role === "seller") {
            console.log(decodedShop)
            // await this.orderService.getAShopOrders(decodedShop.sub)
        } else {
            throw new ForbiddenException()
        }
    }
}