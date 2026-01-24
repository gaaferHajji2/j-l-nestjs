import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateUploadDto } from '../dto/create-upload.dto';

@Injectable()
export class FileUploadValidator {
  async validateFiles(files: any, body: any) {
    // Check if main image exists
    if (!files?.mainImage?.[0]) {
      throw new BadRequestException('Main image is required');
    }

    // Check secondary images count (max 3)
    if (files.secondaryImages && files.secondaryImages.length > 3) {
      throw new BadRequestException('Maximum 3 secondary images allowed');
    }

    // Validate file types
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    
    // Validate main image
    const mainImage = files.mainImage[0];
    if (!allowedMimes.includes(mainImage.mimetype)) {
      throw new BadRequestException('Main image must be a JPEG, PNG, or GIF');
    }

    // Validate secondary images if they exist
    if (files.secondaryImages) {
      for (const image of files.secondaryImages) {
        if (!allowedMimes.includes(image.mimetype)) {
          throw new BadRequestException('Secondary images must be JPEG, PNG, or GIF');
        }
      }
    }

    // Validate other fields
    const dto = plainToClass(CreateUploadDto, body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return {
      mainImage: mainImage,
      secondaryImages: files.secondaryImages || [],
      data: dto
    };
  }
}
