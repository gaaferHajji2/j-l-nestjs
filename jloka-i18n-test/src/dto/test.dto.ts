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
  @IsNotEmpty({message: "validation.EMAIL_NOT_EMPTY"})
  @IsEmail({ }, {message: "validation.INVALID_EMAIL"})
  email: string;

  @IsNotEmpty({message: "validation.PASSWORD_NOT_EMPTY"})
  password: string;
}