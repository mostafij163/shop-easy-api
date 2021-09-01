import * as mongoose from "mongoose";
import * as crypto from "crypto"
import { CommonUsers } from "./usersCommon";

export function generateRandomToken<T extends CommonUsers>(schema: mongoose.Schema<T>) {
    return schema.methods.generateRandomToken = function (this: T, exp: number) {
        const token = crypto.randomBytes(32).toString('hex');
        this.token = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');
        this.tokenExp = Date.now() * exp
        return token
    }
}