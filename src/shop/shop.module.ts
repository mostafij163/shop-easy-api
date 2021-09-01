import { Module, } from '@nestjs/common';
import { ShopController, } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';
import { ClothAndShoeService } from './services/productServices/clothAndShoe.service';
import { ProductFactoryService } from './services/productFactory.service';
import { registeredSchemas } from './utils/registeredSchemas';
import { MedicineService } from './services/productServices/medicine.service';
import { FilterService } from './services/filter.service';
import { AuthenticationModule } from 'src/authentication/auth.module';

@Module({
  imports: [registeredSchemas, AuthenticationModule],
  controllers: [ShopController, ],
  providers: [
    ShopService,
    ProductFactoryService,
    ClothAndShoeService,
    MedicineService,
    FilterService,
  ]
})
export class ShopModule {}
