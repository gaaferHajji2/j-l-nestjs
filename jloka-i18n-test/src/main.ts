import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './exceptions/bad-request.exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const service = app.get(I18nService<Record<string, unknown>>)

  app.useGlobalFilters(new BadRequestExceptionFilter(service))
  app.useGlobalPipes(new ValidationPipe())

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
