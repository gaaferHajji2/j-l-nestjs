import { Expose, Type } from 'class-transformer';
import { PostResponseDto } from '../../post/dto/post-response.dto';

export class CategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => PostResponseDto)
  posts?: PostResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
