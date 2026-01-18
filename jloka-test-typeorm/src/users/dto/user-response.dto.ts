import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import { PostResponseDto } from '../../post/dto/post-response.dto';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @Expose()
  @Type(() => ProfileResponseDto)
  profile?: ProfileResponseDto;

  @Expose()
  @Type(() => PostResponseDto)
  posts?: PostResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password?: string;
}