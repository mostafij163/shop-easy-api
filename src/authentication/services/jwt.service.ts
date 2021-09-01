import { BadRequestException, Injectable, Optional } from "@nestjs/common";
import * as jwt from "jsonwebtoken";
import { ALGORITHMS, JWTOptions } from "../utils/jwtOptions.interface";

@Injectable()
export class JWTService {
    private jwtSecret: string;
    constructor(
        @Optional() jwtSecret: string,
    ) {
        if (jwtSecret) {
            this.jwtSecret = jwtSecret
        } else if (process.env.JWT_SECRET) {
            this.jwtSecret = process.env.JWT_SECRET
        } else {
            throw new Error('Could not find JWT_SECRET')
        }
    }

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