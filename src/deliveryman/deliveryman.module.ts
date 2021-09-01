import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationModule } from '../authentication/auth.module';
import { DeliveryManController } from './deliveryman.controller';
import { DeliveryMan, deliverymanSchema } from './schemas/deliveryman.schema';
import { DeliveryManService } from './services/deliveryman.service';

@Module({
    imports: [
        MongooseModule.forFeature([{
            name: DeliveryMan.name,
            schema: deliverymanSchema
        }]),
        forwardRef(() => AuthenticationModule)
    ],
    providers: [DeliveryManService],
    controllers: [DeliveryManController],
    exports: [DeliveryManService]
})
export class DeliverymanModule {}
