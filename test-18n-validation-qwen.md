To translate validation messages in NestJS using internationalization (i18n), **`nestjs-i18n`** (by Toon van Herreweghe) is the industry-standard solution. It integrates seamlessly with `class-validator`, supports dynamic language resolution, placeholder replacement, and structured error responses. Here's a concise, production-ready implementation guide:

---

### ✅ Step-by-Step Implementation
#### 1. **Install Dependencies**
```bash
npm install nestjs-i18n i18next class-validator class-transformer
npm install -D @types/i18next
```

#### 2. **Create Translation Files**
Structure: `src/i18n/{lang}/validation.json`  
Example (`src/i18n/en/validation.json`):
```json
{
  "IS_STRING": "The {{property}} must be a string",
  "IS_EMAIL": "Invalid email format for {{property}}",
  "MIN_LENGTH": "{{property}} must be at least {{constraint1}} characters"
}
```
Example (`src/i18n/fr/validation.json`):
```json
{
  "IS_STRING": "Le champ {{property}} doit être une chaîne de caractères",
  "IS_EMAIL": "Format email invalide pour {{property}}",
  "MIN_LENGTH": "{{property}} doit contenir au moins {{constraint1}} caractères"
}
```
> 💡 **Key Notes**:  
> - Use `{{property}}`, `{{value}}`, `{{constraint1}}` (i18next syntax).  
> - `nestjs-i18n` auto-replaces class-validator placeholders (`$property` → `{{property}}`).  
> - Organize keys under `validation` namespace if using nested JSON (configure `namespace` in module).

#### 3. **Configure `I18nModule` (AppModule)**
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { I18nModule, QueryResolver, HeaderResolver } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV !== 'production', // Disable watch in prod
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },      // ?lang=fr
        { use: HeaderResolver, options: ['x-lang'] },   // Custom header
        // Add CookieResolver, AcceptLanguageResolver, etc. as needed
      ],
      // Optional: Format validation errors consistently
      formatter: (template, args) => template.replace(/\{\{(.*?)\}\}/g, (_, key) => args?.[key] || ''),
    }),
  ],
})
export class AppModule {}
```

#### 4. **Global Setup (main.ts)**
```typescript
// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { I18nValidationPipe, I18nValidationExceptionFilter } from 'nestjs-i18n';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Translate validation messages + enforce DTO rules
  app.useGlobalPipes(
    new I18nValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  // Catch validation errors & return translated, structured response
  app.useGlobalFilters(new I18nValidationExceptionFilter());

  await app.listen(3000);
}
bootstrap();
```

#### 5. **DTO: Use Translation Keys**
```typescript
// create-user.dto.ts
import { IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'validation.IS_STRING' })
  name: string;

  @IsEmail({}, { message: 'validation.IS_EMAIL' })
  email: string;

  @MinLength(6, { message: 'validation.MIN_LENGTH' })
  password: string;
}
```
> ✨ **No key?** Omit `message` to use default constraint names (e.g., `isEmail`), but explicit keys give full control.

#### 6. **Custom Validator Example**
```typescript
// password-strength.validator.ts
import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'isPasswordStrong', async: false })
@Injectable()
export class PasswordStrengthValidator implements ValidatorConstraintInterface {
  validate(password: string) {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
  }

  defaultMessage() {
    return 'validation.PASSWORD_STRENGTH'; // Key defined in translation files
  }
}
```
Add to translations:  
`"PASSWORD_STRENGTH": "{{property}} requires 8+ chars, uppercase, and a number"`

---

### 🔑 Critical Best Practices
| Area | Recommendation |
|------|----------------|
| **Placeholders** | Use `{{property}}`, `{{constraint1}}` (i18next syntax). Library auto-maps class-validator values. |
| **Language Resolution** | Chain resolvers: Query → Header → Cookie → Fallback. Order matters! |
| **Error Format** | `I18nValidationExceptionFilter` returns:<br>`{ statusCode: 400, message: ["Translated error 1", ...], error: "Bad Request" }` |
| **Testing** | Append `?lang=fr` to requests or set `x-lang: fr` header. |
| **Production** | Set `watch: false`, precompile translations, and cache with `i18next-fs-backend`. |
| **Nesting** | Use `namespace: 'validation'` in module config if translations are under `validation` key. |

---

### ❌ Avoid These Pitfalls
- **Don’t hardcode messages** in decorators (breaks i18n).
- **Don’t skip `I18nValidationExceptionFilter`** – raw errors leak keys like `"validation.IS_EMAIL"`.
- **Don’t use `$property`** in translation files – use `{{property}}` (i18next syntax).
- **Avoid request-scoped validators** for translation – return keys from `defaultMessage()`; translation happens in the pipe.

---

### 💡 Why This Approach?
- ✅ **Zero decorator changes** needed if using constraint-name fallback (though explicit keys are safer).
- ✅ **Full context awareness**: Language resolved per-request via headers/query.
- ✅ **Placeholder safety**: Auto-sanitizes values to prevent XSS in error messages.
- ✅ **Framework-agnostic translations**: Reuse `validation.json` in frontend if needed.
- ✅ **Actively maintained** (v11+ as of 2026) with NestJS 10+ support.

For advanced use cases (async validators, pluralization, RTL support), consult the [official docs](https://nestjs-i18n.com). This setup delivers production-grade i18n validation with minimal boilerplate. 🌍✨