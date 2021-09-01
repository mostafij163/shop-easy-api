import { Location } from "../../location/schemas/location.schema";
import { ProductList } from "../utils/productList.type";

export class NewOrderDTO {
    customer!: string;
    customerName!: string
    productList!: Array<ProductList>
    deliveryLocation!: Location
    total!: number
}