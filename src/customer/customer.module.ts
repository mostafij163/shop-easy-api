import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './services/customer.service';
import { EmailService } from '../authentication/services/email.service';
import { JWTService } from '../authentication/services/jwt.service';
import { ALGORITHMS } from '../authentication/utils/jwtOptions.interface';
// import registeredSchemas from './utils/registeredSchemas';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, customerSchema } from './schemas/customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Customer.name,
        schema: customerSchema
      }
    ]),
    forwardRef(() => AuthenticationModule),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
