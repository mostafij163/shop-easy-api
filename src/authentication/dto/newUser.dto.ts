import { IsEmail, IsNotEmpty, IsPassportNumber, IsString } from "class-validator";

export class NewUserDTO {
    @IsEmail()
    email!: string
    @IsString()
    name!: string
    @IsNotEmpty()
    password!: string
    @IsNotEmpty()
    confirmPassword?: string
}