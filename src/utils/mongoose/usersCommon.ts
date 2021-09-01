import * as mongoose from "mongoose"

export class CommonUsers extends mongoose.Document {
    password!: string
    email!: string
    name!: string
    token?: string
    tokenExp?: number

}