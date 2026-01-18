import { Expose } from 'class-transformer';

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
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
