import {
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNotEmpty,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ExtraUserDto {
  @IsBoolean()
  subscribeToEmail: string;

  @Min(5)
  min: number;

  @Max(10)
  max: number;
}

export class CreateUserDto {
  @IsNotEmpty({message: "EMAIL_NOT_EMPTY", context: { code: "EMAIL_EMPTY"}})
  @IsEmail({ }, {message: "IS_EMAIL", context: { code: "EMAIL_FORMAT" }})
  email: string;

  @IsNotEmpty({message: "PASSWORD_NOT_EMPTY", context: { code: "PASSWORD_EMPTY" }})
  password: string;
}