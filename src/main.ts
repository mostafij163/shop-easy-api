import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import AllExceptionFilter from './utils/exceptions/exceptionsFilter';

const env = dotenv.config({path: './.env'});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors()
  app.use(morgan("dev"))
  app.use(express.static(path.join(__dirname, '..', 'public')))
  app.useGlobalFilters(new AllExceptionFilter())
  await app.listen(8000);
  console.log(`app running on ${await app.getUrl()}`)
  if (env.error) {
    console.error(env.error);
  }
}
bootstrap();
