import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt"
import { AuthController } from './auth.controller';
import { EmailService } from './services/email.service';
import { JWTService } from './services/jwt.service';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/Jwt.strategy';
import { GetUserService } from './services/getUser.service';
import { CustomerModule } from 'src/customer/customer.module';
import { SellerModule } from 'src/seller/seller.module';
import { DeliverymanModule } from '../deliveryman/deliveryman.module';


@Module({
    imports: [
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET
        }),
        forwardRef(() => CustomerModule),
        forwardRef(() => SellerModule),
        forwardRef(() => DeliverymanModule)
    ],
    providers: [
        GetUserService,
        EmailService,
        JWTService,
        AuthService,
        JwtStrategy,
    ],
    controllers: [AuthController],
    exports: [
        EmailService,
        JWTService,
        AuthService,
        JwtStrategy,
        GetUserService
    ]
})
export class AuthenticationModule {}
