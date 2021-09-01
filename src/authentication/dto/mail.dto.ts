import { IsEmail } from "class-validator"

export class MailDTO {
    @IsEmail()
    to!: string
    data?: any
}