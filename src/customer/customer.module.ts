import { Module, forwardRef } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './services/customer.service';
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
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [CustomerService]
})
export class CustomerModule {}
