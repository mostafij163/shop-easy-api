import { Inject, Module } from '@nestjs/common';
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
import { ConfigModule } from '@nestjs/config';

mongoose.set('useCreateIndex', true);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    AuthenticationModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/shopEasy',
    {
      autoIndex: false,
      useFindAndModify: false
      }),
    CustomerModule,
    OrderModule,
    ShopModule,
    SellerModule,
    LocationModule,
    DeliverymanModule
  ],
    controllers: [AppController],
})
export class AppModule {}
