import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Order, orderSchema } from "./schemas/order.schema";
import { OrderController } from "./order.controller";
import { OrderService } from "./services/order.service";
import { OrderGateway } from "./services/order.gateway";
import { AuthenticationModule } from "../authentication/auth.module";

@Module({
    imports: [
        AuthenticationModule,
        MongooseModule.forFeature([
            {
                name: Order.name,
                schema: orderSchema
            }
        ]),
    ],
    providers: [OrderService, OrderGateway],
    controllers: [OrderController],
    exports: [OrderService, OrderGateway]
})
export class OrderModule {}