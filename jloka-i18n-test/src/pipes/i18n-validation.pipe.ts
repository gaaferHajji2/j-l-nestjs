import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class JI18nValidationPipe implements PipeTransform<any> {
  constructor(private readonly i18n: I18nService) {}

  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      const translatedErrors = await Promise.all(
        errors.map(async (error) => {
          const constraints = {};
          for (const [key, value] of Object.entries(error.constraints!)) {
            constraints[key] = await this.i18n.translate(`validation.${key}`, {
              args: {
                property: error.property,
                constraints: error.constraints,
                value: error.value,
              },
            });
          }
          return {
            property: error.property,
            constraints,
          };
        }),
      );

      throw new BadRequestException(translatedErrors);
    }

    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}