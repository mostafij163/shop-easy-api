import * as jwt from "jsonwebtoken";

export interface JWTOptions {
    algorithm?: jwt.Algorithm
    expiresIn?: string
    audience?: string
    issuer?: string
    subject?: string
    notBefore?: string
}

export enum ALGORITHMS {
    HS256 ='HS256',
    HS384 = "HS384",
    HS512 = "HS512",
    RS256 = "RS256",
    RS384 = "RS384",
    RS512 = "RS512",
    ES256 = "ES256",
    ES384 = "ES384",
    ES512 = "ES512",
    none = "none"
}