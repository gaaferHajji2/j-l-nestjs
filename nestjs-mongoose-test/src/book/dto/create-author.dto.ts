import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsEmail, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John', description: 'Author first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Author last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Renowned science fiction writer...' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ example: '1970-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ example: ['65d4f1a2b3c4d5e6f7g8h9i0'], description: 'Category IDs' })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  specializations?: string[];

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
