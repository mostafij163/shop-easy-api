import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { CustomerService } from "src/customer/services/customer.service";
import { SellerService } from "src/seller/seller.service";
import { DeliveryManService } from "../../deliveryman/services/deliveryman.service";
import { ShopService } from "../../shop/services/shop.service";

export class GetUserService {
    constructor(
        @Inject(forwardRef(() => SellerService))
        private sellerService: SellerService,
        @Inject(forwardRef(() => CustomerService))
        private customerService: CustomerService,
        @Inject(forwardRef(() => DeliveryManService))
        private deliveryManService: DeliveryManService,
    ) {}

    getService(category: string): SellerService | CustomerService | DeliveryManService {
        if (category === "seller") return this.sellerService
        else if (category === 'customer') return this.customerService
        else if(category === "deliveryman") return this.deliveryManService
        else throw new BadRequestException('Invalid user type')
    }
}