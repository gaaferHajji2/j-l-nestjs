import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    })
  )

  // Use i18n validation pipe
  app.useGlobalPipes(new I18nValidationPipe());
  
  // Use i18n exception filter for better error formatting
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
