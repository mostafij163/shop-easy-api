import { BadRequestException, forwardRef, Inject } from "@nestjs/common";
import { CustomerService } from "src/customer/services/customer.service";
import { SellerService } from "src/seller/seller.service";

export class GetUserService {
    constructor(
        @Inject(forwardRef(() => SellerService))
        private sellerService: SellerService,
        @Inject(forwardRef(() => CustomerService))
        private customerService: CustomerService
    ) {}

    getService(category: string): SellerService | CustomerService {
        if (category === "seller") return this.sellerService
        else if(category === 'customer') return this.customerService
        else throw new BadRequestException('Invalid user type')
    }
}