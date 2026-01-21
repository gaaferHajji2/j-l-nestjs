import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class ProfileResponseDto {
  @Expose()
  id: string;

  @Expose()
  bio?: string;

  @Expose()
  website?: string;

  @Expose()
  location?: string;

  @Expose()
  avatarUrl?: string;

  @Expose()
  userId: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
