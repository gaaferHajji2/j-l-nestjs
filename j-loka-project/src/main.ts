import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * For Validation And Requests With transform
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  /**
   * For Swagger Building
   */
  const builder = new DocumentBuilder()
    .setTitle('JLoka testing nestjs')
    .setDescription(
      'JLoka Test NestJS For Building wep apis with real-time, host now is: http://localhost:3000',
    )
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, builder);
  // the first param is the path to document
  SwaggerModule.setup('docs', app, doc);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
