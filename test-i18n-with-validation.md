Implementing translation for validation messages in NestJS is best achieved using the dedicated @khoativi/nestjs-class-validator-i18n package, which integrates seamlessly with the built-in ValidationPipe and class-validator library. 
This method allows for dynamic language detection (e.g., via the Accept-Language header) and the use of standard JSON translation files, eliminating the need to manually specify a message for every validation decorator. 
Step-by-Step Implementation
1. Installation
Install the required package:
bash
npm install @khoativi/nestjs-class-validator-i18n class-validator class-transformer
# or 
yarn add @khoativi/nestjs-class-validator-i18n class-validator class-transformer
The class-validator and class-transformer packages are likely already installed in a standard NestJS project. 
2. Create Translation Files
Create a directory for your translation files (e.g., src/i18n) and add JSON files for each supported language. These files will map validation keys to localized messages. 
src/i18n/en.json:
json
{
  "validation": {
    "IS_NOT_EMPTY": "{property} cannot be empty",
    "IS_EMAIL": "{property} must be an email address",
    "MIN_LENGTH": "{property} must be at least {constraints.0} characters long"
  }
}
src/i18n/fr.json:
json
{
  "validation": {
    "IS_NOT_EMPTY": "{property} ne peut pas être vide",
    "IS_EMAIL": "{property} doit être une adresse e-mail valide",
    "MIN_LENGTH": "{property} doit contenir au moins {constraints.0} caractères"
  }
}
You can use special tokens like {property}, {value}, and {constraints.0} in your messages, which class-validator will replace dynamically. 
3. Configure and Register Globally
In your main.ts file, register the global ValidationPipe and I18nValidationExceptionFilter provided by the package. This will automatically translate validation errors before they are sent to the client. 
src/main.ts:
typescript
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { 
  I18nValidationExceptionFilter, 
  // I18nValidationPipe is also an option if you need a custom pipe instance
} from '@khoativi/nestjs-class-validator-i18n'; 
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set up global pipe for validation
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    // Ensure that class-validator uses the I18nContext to find the message
    // Note: The @khoativi package handles the underlying message sourcing
  }));

  // Set up global filter for handling the exception and returning translated messages
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new I18nValidationExceptionFilter(httpAdapter));

  await app.listen(3000);
}
bootstrap();
The library internally handles reading the Accept-Language header to determine the correct locale. 
4. Update Your DTOs 
In your Data Transfer Objects (DTOs), you no longer need to provide explicit message strings for each decorator. The package will automatically map the default class-validator constraint names (e.g., IS_NOT_EMPTY) to the keys in your JSON files.
src/users/dto/create-user.dto.ts:
typescript
import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsEmail()
  email: string;
}
By following these steps, your NestJS application will return dynamically translated validation messages based on the client's language preference.