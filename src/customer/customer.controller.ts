import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { CustomerService } from './services/customer.service';
import { NewUserDTO } from '../authentication/dto/newUser.dto';

@Controller('customer')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) { }

    @Post('/auth/registration')
    signUp(@Body() userDto: NewUserDTO) {
        if (userDto.password === userDto.confirmPassword && userDto.password.length < 6) {
            return new HttpException('Passwords does not matched', HttpStatus.UNPROCESSABLE_ENTITY)
        }
        return this.customerService.createUser(userDto)
    }

    @Post('/auth/login')
    async login(@Body() credential: {email: string, password: string}) {
        return await this.customerService.login(credential);
    }

    @Get('auth/:token')
    async verifyAcc(@Param('token') token: string) {
        return await this.customerService.verifyAcc(token);
    }

    @Get(':email')
    async getACustomer(@Param('email') email: string) {
        console.log(email)
        return this.customerService.findUserByEmail(email)
    }
}
