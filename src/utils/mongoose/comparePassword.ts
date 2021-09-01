import * as mongoose from "mongoose";
import * as bcrypt from "bcryptjs"
import { CommonUsers } from "src/utils/mongoose/usersCommon";

export function comparePassword<T extends CommonUsers>(schema: mongoose.Schema<T>) {
    return schema.methods.comparePassword = async function (password: string, savedPassword: string) {
        return await bcrypt.compare(password, savedPassword);
    }
}