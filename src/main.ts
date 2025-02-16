import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';

import { Logger as PinoLogger } from 'nestjs-pino';
import helmet from 'helmet';

import { AppModule } from './app.module';

import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    bodyParser: true,
  });

  // Increase payload size limit
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.useLogger(app.get(PinoLogger));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(helmet());

  app.enableCors({
    origin: process.env.CLIENT_URL ?? '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);

  const logger = new Logger('Bootstrap');

  logger.log(`App is running on ${await app.getUrl()}`);
}

bootstrap();
