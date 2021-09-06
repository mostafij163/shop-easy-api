import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, orderSchema } from "./schemas/order.schema";
import { OrderController } from "./order.controller";
import { OrderService } from "./services/order.service";
import { OrderGateway } from "./services/order.gateway";
import { ShopModule } from "../shop/shop.module";
import { SellerModule } from "../seller/seller.module";
import { LocationModule } from "../location/location.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Order.name,
                schema: orderSchema
            },
        ]),
        ShopModule,
        LocationModule
    ],
    providers: [OrderService, OrderGateway],
    controllers: [OrderController],
    exports: [OrderService, OrderGateway]
})
export class OrderModule {}