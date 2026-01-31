### Step 1: Install Required Packages
To implement internationalization (i18n) for validation messages in a NestJS application, use the `nestjs-i18n` package, which integrates well with `class-validator` for translating error messages. This is a trusted approach based on official documentation and community usage.

Install the following packages (versions as of January 31, 2026):

- `nestjs-i18n`: ^10.6.0 (core i18n module for NestJS)
- `i18next`: ^25.8.0 (internationalization framework)
- `i18next-fs-backend`: ^2.6.1 (backend for loading translations from files)
- `class-validator`: ^0.14.3 (for DTO validation)
- `class-transformer`: ^0.5.1 (for transforming plain objects to class instances)
- `@nestjs/common`: ^11.1.12 (NestJS core utilities, including ValidationPipe)

Run the installation command:
```
npm install nestjs-i18n@10.6.0 i18next@25.8.0 i18next-fs-backend@2.6.1 class-validator@0.14.3 class-transformer@0.5.1 @nestjs/common@11.1.12
```

These versions are compatible and widely used in production setups. Ensure your NestJS project is on version ~11.x for best compatibility.

### Step 2: Configure the I18n Module
In your `app.module.ts`, import and configure the `I18nModule` to load translation files. Translations are typically stored in JSON files under a directory like `src/i18n/` (e.g., `en/validation.json`, `fr/validation.json`).

```typescript
import { Module } from '@nestjs/common';
import { I18nModule, I18nJsonLoader, QueryResolver, AcceptLanguageResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en', // Default language
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'), // Path to translation files
        watch: true, // Reload on changes in development
      },
      loader: I18nJsonLoader,
      resolvers: [
        { use: QueryResolver, options: ['lang'] }, // e.g., ?lang=fr
        AcceptLanguageResolver, // Uses Accept-Language header
      ],
    }),
    // Other modules...
  ],
})
export class AppModule {}
```

This setup uses file-based translations and resolves language from query params or headers.

### Step 3: Set Up Global Validation with I18n
In `main.ts`, configure the global `I18nValidationPipe` instead of the standard `ValidationPipe`. This pipe handles translated validation messages.

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new I18nValidationPipe({
      transform: true, // Automatically transform payloads to DTO types
      whitelist: true, // Strip non-defined properties
      forbidNonWhitelisted: true, // Throw error on extra properties
    }),
  );
  await app.listen(3000);
}
bootstrap();
```

This ensures all incoming requests use i18n-aware validation.

### Step 4: Define DTO with Translated Validation Messages
In your DTO (e.g., `create-user.dto.ts`), use validators from `class-validator` and the `i18nValidationMessage` helper for messages. This references keys in your translation files.

```typescript
import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsString({ message: i18nValidationMessage('validation.IS_STRING') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  name: string;

  @MinLength(8, { message: i18nValidationMessage('validation.MIN_LENGTH', { min: 8 }) })
  password: string;
}
```

The second argument to `i18nValidationMessage` allows passing constraints like `{ min: 8 }`, which can be interpolated in translations.

### Step 5: Create Translation Files
Place JSON files in `src/i18n/` with nested keys. For example:

- `en/validation.json` (English):
```json
{
  "IS_STRING": "The value must be a string.",
  "NOT_EMPTY": "This field cannot be empty.",
  "MIN_LENGTH": "The value must be at least {{min}} characters long."
}
```

- `fr/validation.json` (French):
```json
{
  "IS_STRING": "La valeur doit être une chaîne de caractères.",
  "NOT_EMPTY": "Ce champ ne peut pas être vide.",
  "MIN_LENGTH": "La valeur doit comporter au moins {{min}} caractères."
}
```

The `{{min}}` placeholder interpolates values from the validator constraints.

### Step 6: Handle Errors and Test
When validation fails, the API will return translated errors based on the resolved language. For example, a response might look like:
```json
{
  "statusCode": 400,
  "message": [
    "The value must be a string."
  ],
  "error": "Bad Request"
}
```

Test by sending requests with `Accept-Language: fr` header or `?lang=fr` query param.

### Additional Notes
- This method is trusted as it's from the official `nestjs-i18n` docs and used in production (e.g., handles interpolation and global pipes without custom filters).
- If you need custom error formatting, extend `I18nValidationExceptionFilter` for more control.
- Avoid untrusted packages; stick to these as they have high downloads and active maintenance.
- For advanced setups (e.g., async loaders), refer to the `nestjs-i18n` documentation.