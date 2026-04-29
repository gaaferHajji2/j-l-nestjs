import { IsOptional, IsString, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBookDto {
  @ApiPropertyOptional({ description: 'Populate author details', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  populateAuthor?: string;

  @ApiPropertyOptional({ description: 'Populate categories', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  populateCategories?: string;

  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;
}
