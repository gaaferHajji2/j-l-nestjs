import { IsString, IsEmail, IsNumber, Min, Max, IsNotEmpty, MinLength, MaxLength, IsEnum, IsArray, ArrayMinSize, ArrayMaxSize, IsBoolean, IsDateString } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(18)
  @Max(100)
  age: number;

  @IsEnum(UserRole)
  role: UserRole;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  tags: string[];

  @IsBoolean()
  isActive: boolean;

  @IsDateString()
  birthDate: string;
}