import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNotEmptyObject,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class ExtraUserDto {
  @IsBoolean()
  subscribeToEmail: string;

  @Min(5, { message: "validation.MIN_MIN"})
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

  @ValidateNested()
  @Type(() => ExtraUserDto)
  @IsNotEmptyObject({}, { message: "validation.EXTRA_REQUIRED"})
  extra: ExtraUserDto;
}