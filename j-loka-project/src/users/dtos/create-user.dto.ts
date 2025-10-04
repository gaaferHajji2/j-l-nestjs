/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator'

export class CreateUserDto {
	@IsString()
	@IsNotEmpty()
	@Length(3, 255)
  firstName: string;

	@IsString()
	@IsOptional()
	@Length(3, 255)
  lastName?: string;
  
	@IsEmail()
	@IsNotEmpty()
	email: string;
  
	@IsString()
	@IsNotEmpty()
	@Length(5, 150)
	password: string;  
}