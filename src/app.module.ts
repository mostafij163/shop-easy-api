import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CustomerModule } from './customer/customer.module';
import { ShopModule } from './shop/shop.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from './authentication/auth.module';
import { SellerModule } from './seller/seller.module';
import * as mongoose from 'mongoose';
import {LocationModule } from "./location/location.module"
import { OrderModule } from './order/order.module';
import { DeliverymanModule } from './deliveryman/deliveryman.module';

mongoose.set('useCreateIndex', true);

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/shopEasy',
    {
      autoIndex: false,
      useFindAndModify: false
      }),
    CustomerModule,
    ShopModule,
    AuthenticationModule,
    SellerModule,
    LocationModule,
    OrderModule,
    DeliverymanModule
  ],
    controllers: [AppController],
})
export class AppModule {}
