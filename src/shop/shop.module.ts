import { Global, Module, } from '@nestjs/common';
import { ShopController, } from './controllers/shop.controller';
import { ShopService } from './services/shop.service';
import { ClothAndShoeService } from './services/productServices/clothAndShoe.service';
// import { registeredSchemas } from './utils/registeredSchemas';
import { MedicineService } from './services/productServices/medicine.service';
import { FilterService } from './services/filter.service';
import { AuthenticationModule } from '../authentication/auth.module';
import { MongooseModule } from '@nestjs/mongoose';

import { ClothAndShoe, clothAndShoeSchema } from "./schemas/productSchemas/clothAndShoe.schema";
import { Medicine, medicineSchema } from "./schemas/productSchemas/medicine.schema";
import { Shop, ShopSchema } from "./schemas/shop.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
        {
            name: Shop.name,
            schema: ShopSchema,
        },
        {
            name: ClothAndShoe.name,
            schema: clothAndShoeSchema,
        },
        {
            name: Medicine.name,
            schema: medicineSchema
        },
    ])
  ],
  controllers: [ShopController, ],
  providers: [
    ShopService,
    ClothAndShoeService,
    MedicineService,
    FilterService,
  ],
  exports: [ShopService, MongooseModule]
})
export class ShopModule {}
