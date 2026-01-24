import { Expose } from "class-transformer";

export class ImageInfoDto {
  @Expose()
  filename: string;
  @Expose()
  url: string;
  @Expose()
  mimetype: string;
  @Expose()
  size: number;
}

export class UploadResponseDto {
  @Expose()
  firstName: string;
  @Expose()
  lastName: string;
  @Expose()
  profession?: string;
  @Expose()
  mainImage: ImageInfoDto;
  @Expose()
  secondaryImages?: ImageInfoDto[];
  @Expose()
  uploadedAt: Date;
}
