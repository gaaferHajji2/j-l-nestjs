import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, MaxLength, IsNotEmpty } from 'class-validator';

class SecondaryImageDto {
  @IsOptional()
  image?: any;
}

export class CreateUploadDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  profession?: string;

  @IsNotEmpty()
  mainImage: any;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecondaryImageDto)
  @IsOptional()
  secondaryImages?: SecondaryImageDto[];
}