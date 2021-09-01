import { Body, Controller, Post, UnprocessableEntityException } from "@nestjs/common";
import { NewDeliveryManDTO } from "./dto/newDeliveryman.dto";
import { DeliveryManService } from "./services/deliveryman.service";

@Controller('deliveryman')
export class DeliveryManController {
    constructor(private deliverymanService: DeliveryManService) { }
    
    @Post('auth/login')
    async login(@Body() credential: {email: string, password: string} ) {
        return await this.deliverymanService.login(credential)
    }

    @Post('auth/registration')
    async singUp(@Body() newDeliveryManDto: NewDeliveryManDTO) {
        if (!(newDeliveryManDto.password === newDeliveryManDto.confirmPassword)) throw new UnprocessableEntityException({
            status: "fail",
            message: "passwords did not macth"
        })
        return await this.deliverymanService.createDeliveryMan(newDeliveryManDto)
    }
}