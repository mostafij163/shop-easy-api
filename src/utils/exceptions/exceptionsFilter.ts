import { InternalServerErrorException } from "@nestjs/common";
import {
    Catch,
    HttpException,
    ExceptionFilter,
    ArgumentsHost,
    HttpStatus,
} from "@nestjs/common"
import { Request, Response } from "express";

@Catch()
export default class AllExceptionFilter implements ExceptionFilter{
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const req = ctx.getRequest<Request>()
        const res = ctx.getResponse<Response>()

        console.log(exception)

        let statusCode: number
        if (exception instanceof HttpException) {
            statusCode = exception.getStatus()
            return res.status(statusCode).json({
                statusCode: statusCode,
                status: "fail",
                message: exception.message,
                path: req.url,
                timestamp: new Date(),
            })
        } else {
            statusCode = HttpStatus.INTERNAL_SERVER_ERROR
        }

        const excepResponse: any = exception.getResponse()

        if (excepResponse.name === "CastError") {
            return res.status(statusCode).json({
                status: 'error',
                message: `Invalid value ${excepResponse.value} for path ${excepResponse.path}`,
                path: req.url,
                timestamp: new Date(),
            })
        }
    }
}