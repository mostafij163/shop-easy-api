import { BadRequestException, Inject, Injectable, Scope } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ALGORITHMS, JWTOptions } from "../utils/jwtOptions.interface";

@Injectable()
export class JWTService {
    constructor(@Inject("JWT_SECRET") private jwtSecret: string,) {}

    signToken(payload: string | object | Buffer,
        jwtOptions: JWTOptions = {
        algorithm: ALGORITHMS.HS256,
        expiresIn: '15d',
        audience: 'customer',
        subject: '',
        issuer: 'shopeasy'
        }): string {
        return jwt.sign(payload, this.jwtSecret, jwtOptions)
    }

    verifyToken(token: string, jwtOptions?: JWTOptions) {
        try {
            return jwt.verify(token, this.jwtSecret, jwtOptions)
        } catch (err:any) {
            throw new BadRequestException({
                statusCode: 401,
                message: err.message
            })
        }
    }
}