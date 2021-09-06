import { forwardRef, Inject, Injectable, } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AuthService } from 'src/authentication/services/auth.service';
import { EmailService } from 'src/authentication/services/email.service';
import { JWTService } from '../authentication/services/jwt.service';
import { NewSellerDTO } from './dto/newSeller.dto';
import { Seller } from './schemas/seller.schema';

@Injectable()
export class SellerService extends AuthService {
    constructor(
        @InjectModel(Seller.name) private SellerModel: mongoose.Model<Seller>,
        protected jwtService: JWTService,
        private emailService: EmailService,
    ) {
        super(SellerModel, jwtService);
    }

    async createSeller(sellerDto: NewSellerDTO) {
        const seller = await this.create(sellerDto);
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
            }, {
            audience: seller.role,
            expiresIn: '15d',
            subject: seller.id
        })
    }

    async getProfile(id: string): Promise<Seller | null> {
        return await this.SellerModel.findById(id);
    }
}
