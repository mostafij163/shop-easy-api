import { Module } from "@nestjs/common";
import { LocationService } from "./services/location.service";

@Module({
    providers: [LocationService]
})
export class LocationModule {}