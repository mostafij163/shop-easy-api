import { Injectable, Optional } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { MailDTO } from "../dto/mail.dto";

@Injectable()
export class EmailService {
    private async send(options: nodemailer.SendMailOptions) {
        let transporter: nodemailer.Transporter
        if (process.env.MAILGUN_USERNAME && process.env.MAILGUN_PASSWORD) {
            transporter = nodemailer.createTransport({
                host: "smtp.mailgun.org",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAILGUN_USERNAME,
                    pass: process.env.MAILGUN_PASSWORD,
                }
            })
        } else {
            throw new Error('could not found email service username or password')
        }
        return await transporter.sendMail(options)
    }

    async sendAccVerifyEmail(mailDto: MailDTO) {
        return await this.send({
            to: mailDto.to,
            from: 'Shop Easy<mostafijur-35-2183@diu.edu.bd>',
            subject: 'Account Verification Token',
            text: mailDto.data.url,
            html: `
            
            <!DOCTYPE html>

            
            `
        })
    }
}
