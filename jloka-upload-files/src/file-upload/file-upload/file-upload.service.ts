import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';
import { CreateUploadDto } from '../dto/create-upload.dto';
import { UploadResponseDto, ImageInfoDto } from '../dto/upload-response.dto';

@Injectable()
export class FileUploadService {
  private readonly uploadPath: string;

  constructor(private configService: ConfigService) {
    this.uploadPath = join(process.cwd(), 'uploads');
    this.ensureUploadDirectory();
  }

  private async ensureUploadDirectory() {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
    }
  }

  private getFileUrl(filename: string): string {
    const baseUrl = this.configService.get('APP_URL', 'http://localhost:3000');
    return `${baseUrl}/uploads/${filename}`;
  }

  private createImageInfo(file: Express.Multer.File): ImageInfoDto {
    return {
      filename: file.filename,
      url: this.getFileUrl(file.filename),
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  async processUpload(
    mainImage: Express.Multer.File,
    secondaryImages: Express.Multer.File[],
    data: CreateUploadDto
  ): Promise<UploadResponseDto> {
    try {
      // Process main image
      const mainImageInfo = this.createImageInfo(mainImage);

      // Process secondary images
      const secondaryImagesInfo = secondaryImages.map(image => 
        this.createImageInfo(image)
      );

      return {
        firstName: data.firstName,
        lastName: data.lastName,
        profession: data.profession,
        mainImage: mainImageInfo,
        secondaryImages: secondaryImagesInfo.length > 0 ? secondaryImagesInfo : undefined,
        uploadedAt: new Date(),
      };
    } catch (error) {
      // Clean up uploaded files in case of error
      await this.cleanupFiles([mainImage, ...secondaryImages]);
      throw new HttpException(
        'Error processing upload',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async cleanupFiles(files: Express.Multer.File[]) {
    for (const file of files) {
      try {
        await fs.unlink(join(this.uploadPath, file.filename));
      } catch (error) {
        // Log error but don't throw
        console.error(`Failed to delete file ${file.filename}:`, error);
      }
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      const filePath = join(this.uploadPath, filename);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${filename}:`, error);
    }
  }

  async getFileInfo(filename: string): Promise<ImageInfoDto | null> {
    try {
      const filePath = join(this.uploadPath, filename);
      await fs.access(filePath);
      const stats = await fs.stat(filePath);
      
      // Determine mimetype from extension (simplified)
      const extension = filename.split('.').pop()?.toLowerCase();
      const mimeTypes = {
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        png: 'image/png',
        gif: 'image/gif',
      };

      return {
        filename,
        url: this.getFileUrl(filename),
        mimetype: extension != undefined ? mimeTypes[extension] : 'application/octet-stream',
        size: stats.size,
      };
    } catch {
      return null;
    }
  }
}
