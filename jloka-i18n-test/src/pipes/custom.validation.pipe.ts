import { ValidationPipe, ValidationError, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

export class CustomI18nValidationPipe extends ValidationPipe {
  constructor(private readonly i18n: I18nService) {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map(error => {
            console.log("Error is: ", error)
          const constraints = Object.keys(error.constraints!).map(key => ({
            type: key,
            message: this.i18n.translate(`validation.${key}`, {
              args: {
                property: error.property,
                value: error.value,
                constraints: error.constraints,
              },
            }),
          }));
          return { field: error.property, errors: constraints };
        });
        return new BadRequestException(messages || {});
      },
    });
  }
}
