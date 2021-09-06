import { BadRequestException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import * as crypto from "crypto"
import { Document, Model } from "mongoose";
import { NewUserDTO } from "src/authentication/dto/newUser.dto";
import { Customer } from "src/customer/schemas/customer.schema";
import { NewSellerDTO } from "src/seller/dto/newSeller.dto";
import { Seller } from "src/seller/schemas/seller.schema";
import { CommonUsers } from "src/utils/mongoose/usersCommon";
import { JWTService } from "./jwt.service";
export class AuthService {
    constructor(
        protected UserModel: Model<any>,
        protected jwtService: JWTService
    ) { }

    protected async create(sellerDto: NewSellerDTO): Promise<Seller>
    protected async create(customerDto: NewUserDTO): Promise<Customer>
    protected async create(userDto: any) {
            try {
                const user = await this.UserModel.create(userDto)
                return user
            } catch (error) {
                throw new InternalServerErrorException(error)
            }
    }

    async findUserById(id: string): Promise<Customer>{
        let user: Customer | null
        try {
            user = await this.UserModel.findById(id).select('+password +activeStatus')
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user;
    }

    async findUserByEmail(email: string): Promise<Customer>{
        let user: Customer | null
        try {
            user = await this.UserModel.findOne({ email: email }).select('+password +activeStatus')
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user;
    }

    async verifyUser(email: string, password: string) {
        let user = await this.findUserByEmail(email);
        if (await user.comparePassword(password, user.password)) {
            return user
        } else {
            throw new BadRequestException('Invalid credential')
        }
    }

    async login(credential: { email: string, password: string }) {
        const user = await this.verifyUser(credential.email, credential.password)
        return this.jwtService.signToken(
            {
                activeStatus: user.activeStatus,
                name: user.name,
            },
            {
                audience: user.role,
                expiresIn: '15d',
                subject: user.id,
                issuer: 'shopeasy'
            }
        )
    }

    async verifyAcc(token: string) {
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
        let user!: any
        try {
            user = await this.UserModel.findOne({ token: hashedToken, tokenExp: { $gt: Date.now() } })
        } catch (err) {
            
        }
        if (user) {
            user.token = undefined;
            user.tokenExp = undefined;
            user.activeStatus = true;
            user.save({ validateBeforeSave: false });
        } else {
            throw new BadRequestException('Invalid token')
        }
    }    
}