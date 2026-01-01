import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  // app.useGlobalFilters(new CatsFilter())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }))

  app.use(
    session.default({
      secret: 'your-strong-random-secret', // Use a strong, random secret
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000 }, // Optional: configure cookie options
    }),
  );

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap();
