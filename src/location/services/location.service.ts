import { Injectable } from "@nestjs/common";

enum units {
    KM = "km",
    MI = "mi",
    M = "m"
}

@Injectable()
export class LocationService {

    calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number, unit?: units) {
        let R = 6371
        if (unit == units.MI) {
            R = 6371 * 0.621371
        } else if (unit == units.M) {
            R = 6371 * 1000
        }

        const dLat = this.degToRadian(lat2 - lat1)
        const dLng = this.degToRadian(lng2 - lng1)

        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.degToRadian(lat1)) * Math.cos(this.degToRadian(lat2)) * 
            Math.sin(dLng/2) * Math.sin(dLng/2)

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        const d = R * c;
        return d;
    }

    private degToRadian(deg: number) {
        return deg * (Math.PI/180)
    }
}