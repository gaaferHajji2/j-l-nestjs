import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDto {
  @IsNotEmpty({ message: i18nValidationMessage('validation.validation.NOT_EMPTY').name })
  @IsEmail({}, { message: i18nValidationMessage('validation.validation.INVALID_EMAIL').name })
  email: string;

  @IsNotEmpty({ message: i18nValidationMessage('validation.validation.NOT_EMPTY').name })
  @MinLength(5, { message: i18nValidationMessage('validation.validation.MIN', { constraint1: 5 }).name })
  username: string;
}