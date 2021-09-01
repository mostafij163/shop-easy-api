import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs"
import { CommonUsers } from "./usersCommon";

export function hashPassword<T extends CommonUsers>(schema: mongoose.Schema<T>) {
    return schema.pre<T>('save', async function (next: mongoose.HookNextFunction) {
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword
        next();
    })
}