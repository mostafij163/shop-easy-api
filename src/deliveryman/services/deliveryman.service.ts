import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuthService } from 'src/authentication/services/auth.service';
import { EmailService } from 'src/authentication/services/email.service';
import { JWTService } from 'src/authentication/services/jwt.service';
import { NewDeliveryManDTO } from '../dto/newDeliveryman.dto';
import { DeliveryMan } from '../schemas/deliveryman.schema';

@Injectable()
export class DeliveryManService extends AuthService {
    constructor(
        @InjectModel(DeliveryMan.name) private DeliveryManModel: mongoose.Model<DeliveryMan>,
        @Inject(forwardRef(() => JWTService))
        protected jwtService: JWTService,
        @Inject(forwardRef(() => EmailService))
        private emailService: EmailService,
    ) {
        super(DeliveryManModel, jwtService);
    }

    async createDeliveryMan(deliverymanDto: NewDeliveryManDTO) {
        const seller = await this.create(deliverymanDto);
        const token = seller.generateRandomToken(60 * 60 * 24 * 15)
        seller.save({ validateBeforeSave: false });
        await this.emailService.sendAccVerifyEmail({
            to: seller.email, data: {
                url: `http://localhost:3000/seller/auth/${token}`
            }
        });
        
        return this.jwtService.signToken(
            {
                activeStatus: seller.activeStatus,
                name: seller.name
            },
            {
                audience: seller.role,
                expiresIn: '15d',
                subject: seller.id,
                issuer: "shopeasy"
            }
        )
    }

    async getProfile(id: string): Promise<DeliveryMan | null> {
        return await this.DeliveryManModel.findById(id);
    }
}
