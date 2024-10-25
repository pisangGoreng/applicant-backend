import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConflictExceptionFilter } from './common/filters/http-exception.filter';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new ConflictExceptionFilter());
  app.useLogger(app.get(Logger));

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
