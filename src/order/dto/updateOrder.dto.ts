import { Location } from "../../location/schemas/location.schema"

export class UpdateOrder {
    deliveryLocation?: Location
    deliveryStatus?: string
    deliveryMan?: string
}