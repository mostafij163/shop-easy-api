import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ALGORITHMS } from "../utils/jwtOptions.interface";
import { GetUserService } from './getUser.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private getUserService: GetUserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            // issuer: "shopeasy",
            algorithms: ALGORITHMS.HS256,
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload: any) {

        // TODO:
        // TODO: check activeStatus

        const user = this.getUserService.getService(payload.aud).findUserById(payload.sub)
        const userDoc = await user;
        return {
            id: userDoc["_id"],
            email: userDoc.email,
            role: userDoc.role,
        }
    }
}