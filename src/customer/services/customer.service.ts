import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { NewUserDTO } from "../../authentication/dto/newUser.dto";
import { Customer } from "../schemas/customer.schema"
import { EmailService } from "../../authentication/services/email.service";
import { JWTService } from "../../authentication/services/jwt.service";
import { AuthService } from "src/authentication/services/auth.service";

@Injectable()
export class CustomerService extends AuthService {
    constructor(
        @InjectModel(Customer.name) private CustomerModel: Model<Customer>,
        protected jwtService: JWTService,
        private emailService: EmailService,
    ) {
        super(CustomerModel, jwtService);
    }

    async createUser(userDto: NewUserDTO) {
        const user = await this.create(userDto);
        const token = user.generateRandomToken(60 * 60 * 24 * 15)
        user.save({ validateBeforeSave: false });
        await this.emailService.sendAccVerifyEmail({ to: user.email, data: { token } });

        return this.jwtService.signToken({ activeStatus: user.activeStatus, name: user.name }, {
            audience: user.role,
            expiresIn: '15d',
            subject: user.id
        })
    }
}
    