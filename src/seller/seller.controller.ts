import { Body, Controller, Get, HttpException, InternalServerErrorException, Param, Post } from '@nestjs/common';
import { NewSellerDTO } from './dto/newSeller.dto';
import { SellerService } from './seller.service';

@Controller('seller')
export class SellerController {
    constructor(private sellerService: SellerService) { }
    
    @Post('auth/registration')
    async signUp(@Body() newSellerDto: NewSellerDTO) {
        return await this.sellerService.createSeller(newSellerDto);
    }

    @Post('auth/login')
    async login(@Body() credential: {email: string, password: string}) {
        try {
            return this.sellerService.login(credential)
        } catch (err) {
            return new InternalServerErrorException();
        }
    }

    @Get('auth/:token')
    async verifyAcc(@Param('token') token: string) {
        return await this.sellerService.verifyAcc(token)
    }

    @Get('profile/:sellerId')
    getSellerProfile(@Param('sellerId') sellerId: string) {
        try {
            return this.sellerService.getProfile(sellerId);
        } catch (err) {
            return new InternalServerErrorException()
        }
    }   
}
