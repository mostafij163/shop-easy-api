import { Body, Controller, Get, HttpCode, Post, Header, Req, Param } from '@nestjs/common';

@Controller("test")
export class AppController {
  @Get()
  getHello(): string {
    return 'hello!'
  }
}
