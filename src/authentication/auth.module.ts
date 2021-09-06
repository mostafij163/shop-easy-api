import { Module, forwardRef, DynamicModule, Global, Scope } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { AuthController } from './auth.controller';
import { EmailService } from './services/email.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/Jwt.strategy';
import { GetUserService } from './services/getUser.service';
import { CustomerModule } from 'src/customer/customer.module';
import { SellerModule } from 'src/seller/seller.module';
import { DeliverymanModule } from '../deliveryman/deliveryman.module';
import { JWTService } from './services/jwt.service';
import { ConfigService } from '@nestjs/config';
import { ShopModule } from '../shop/shop.module';

@Global()
@Module({
    imports: [
        PassportModule,
        forwardRef(() => CustomerModule),
        forwardRef(() => SellerModule),
        forwardRef(() => DeliverymanModule),
    ],
    providers: [
        GetUserService,
        EmailService,
        AuthService,
        JwtStrategy,
        JWTService,
        {
            provide: "JWT_SECRET",
            useFactory: (configService: ConfigService) => configService.get<string>("JWT_SECRET"),
            inject: [ConfigService],
        }
    ],
    exports: [
        EmailService,
        AuthService,
        JwtStrategy,
        GetUserService,
        JWTService
    ]
})
export class AuthenticationModule {}
