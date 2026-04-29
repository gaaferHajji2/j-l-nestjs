import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsNumber, IsDateString, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Adventure', description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '978-3-16-148410-0', description: 'ISBN number' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiPropertyOptional({ example: 'An exciting journey through...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 29.99, description: 'Book price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({ example: '65d4f1a2b3c4d5e6f7g8h9i0', description: 'Author ID' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ example: ['65d4f1a2b3c4d5e6f7g8h9i0', '65d4f1a2b3c4d5e6f7g8h9i1'], description: 'Category IDs' })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  categories?: string[];

  @ApiPropertyOptional({ example: 100, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}