import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { 
  I18nValidationException,
  I18nValidationFilter, 
  // I18nValidationPipe is also an option if you need a custom pipe instance
} from '@khoativi/nestjs-class-validator-i18n'; 

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors): I18nValidationException =>
        new I18nValidationException(errors),

    }),
  );

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new I18nValidationFilter(adapterHost, { fallbackLanguage: 'en' }),
  );


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
