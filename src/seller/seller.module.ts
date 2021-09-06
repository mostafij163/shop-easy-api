import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from 'src/authentication/auth.module';
import { Seller, sellerSchema } from './schemas/seller.schema';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Seller.name,
      schema: sellerSchema,
    }])
  ],
  controllers: [SellerController],
  providers: [SellerService],
  exports: [SellerService]
})
export class SellerModule {}
