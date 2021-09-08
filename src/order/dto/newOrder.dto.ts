import { Location } from "../../location/schemas/location.schema";
import { ProductList } from "../schemas/productList.schema";

export class NewOrderDTO {
    customer!: string;
    customerName!: string
    productList!: Array<ProductList>
    deliveryLocation!: Location
    total!: number
}