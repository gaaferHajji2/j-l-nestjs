I'll create a complete file upload system for NestJS with validation. Here's the step-by-step implementation:

## 1. First, install required packages:

```bash
npm install @nestjs/platform-express multer
npm install -D @types/multer
npm install class-validator class-transformer
npm install uuid
```

## 2. Create Configuration and Constants:

**src/config/multer.config.ts**
```typescript
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerConfig = {
  dest: './uploads',
};

export const multerOptions = {
  // Enable file size limits
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  // Check the mimetypes to allow for upload
  fileFilter: (req: any, file: any, cb: any) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
      // Allow storage of file
      cb(null, true);
    } else {
      // Reject file
      cb(new HttpException(`Unsupported file type ${extname(file.originalname)}`, HttpStatus.BAD_REQUEST), false);
    }
  },
  // Storage properties
  storage: diskStorage({
    // Destination storage path details
    destination: multerConfig.dest,
    // File modification details
    filename: (req: any, file: any, cb: any) => {
      // Calling the callback passing the random name generated with the original extension name
      cb(null, `${uuidv4()}${extname(file.originalname)}`);
    },
  }),
};
```

## 3. Create DTOs:

**src/file-upload/dto/create-upload.dto.ts**
```typescript
import { Type } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested, MaxLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class SecondaryImageDto {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  @IsOptional()
  image?: any;
}

export class CreateUploadDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'Developer' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  profession?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  @IsNotEmpty()
  mainImage: any;

  @ApiProperty({ 
    type: 'array', 
    items: { type: 'string', format: 'binary' }, 
    required: false,
    maxItems: 3 
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecondaryImageDto)
  @IsOptional()
  secondaryImages?: SecondaryImageDto[];
}
```

**src/file-upload/dto/upload-response.dto.ts**
```typescript
import { ApiProperty } from '@nestjs/swagger';

export class ImageInfoDto {
  @ApiProperty({ example: 'main-image.jpg' })
  filename: string;

  @ApiProperty({ example: 'http://localhost:3000/uploads/main-image.jpg' })
  url: string;

  @ApiProperty({ example: 'image/jpeg' })
  mimetype: string;

  @ApiProperty({ example: 123456 })
  size: number;
}

export class UploadResponseDto {
  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiProperty({ example: 'Developer', required: false })
  profession?: string;

  @ApiProperty({ type: ImageInfoDto })
  mainImage: ImageInfoDto;

  @ApiProperty({ type: [ImageInfoDto], required: false })
  secondaryImages?: ImageInfoDto[];

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  uploadedAt: Date;
}
```

## 4. Create Validator Pipe:

**src/file-upload/validation/file-upload.validator.ts**
```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

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
```

## 5. Create File Upload Service:

**src/file-upload/services/file-upload.service.ts**
```typescript
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
        mimetype: mimeTypes[extension] || 'application/octet-stream',
        size: stats.size,
      };
    } catch {
      return null;
    }
  }
}
```

## 6. Create Controller:

**src/file-upload/controllers/file-upload.controller.ts**
```typescript
import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles, 
  Body, 
  ParseFilePipeBuilder, 
  HttpStatus,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  Get,
  Param,
  Delete
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';
import { FileUploadValidator } from '../validation/file-upload.validator';
import { CreateUploadDto } from '../dto/create-upload.dto';
import { UploadResponseDto } from '../dto/upload-response.dto';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { multerOptions } from '../../config/multer.config';

@ApiTags('file-upload')
@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly fileUploadValidator: FileUploadValidator,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload files with additional data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload with additional fields',
    type: CreateUploadDto,
  })
  @ApiResponse({ status: 201, type: UploadResponseDto })
  @UseInterceptors(
    FilesInterceptor('mainImage', 1, multerOptions),
    FilesInterceptor('secondaryImages', 3, multerOptions),
  )
  async uploadFiles(
    @UploadedFiles() files: any,
    @Body() body: CreateUploadDto,
  ): Promise<UploadResponseDto> {
    // Validate files and data
    const validated = await this.fileUploadValidator.validateFiles(files, body);
    
    // Process the upload
    return this.fileUploadService.processUpload(
      validated.mainImage,
      validated.secondaryImages,
      validated.data,
    );
  }

  @Get('file/:filename')
  @ApiOperation({ summary: 'Get file information' })
  async getFileInfo(@Param('filename') filename: string) {
    const fileInfo = await this.fileUploadService.getFileInfo(filename);
    if (!fileInfo) {
      throw new BadRequestException('File not found');
    }
    return fileInfo;
  }

  @Delete('file/:filename')
  @ApiOperation({ summary: 'Delete a file' })
  async deleteFile(@Param('filename') filename: string) {
    await this.fileUploadService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
```

## 7. Create Module:

**src/file-upload/file-upload.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FileUploadController } from './controllers/file-upload.controller';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadValidator } from './validation/file-upload.validator';

@Module({
  imports: [ConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService, FileUploadValidator],
  exports: [FileUploadService],
})
export class FileUploadModule {}
```

## 8. Update Main Module:

**src/app.module.ts**
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    FileUploadModule,
  ],
})
export class AppModule {}
```

## 9. Create CLI Commands for File Creation:

Here are the commands to create each file:

```bash
# Create config
nest g cl config/multer

# Create DTOs
nest g class file-upload/dto/create-upload.dto --no-spec
nest g class file-upload/dto/upload-response.dto --no-spec

# Create validator
nest g class file-upload/validation/file-upload.validator --no-spec

# Create service
nest g service file-upload/services/file-upload --no-spec

# Create controller
nest g controller file-upload/controllers/file-upload --no-spec

# Create module
nest g module file-upload --no-spec
```

## 10. Testing with cURL:

```bash
# Upload with main image and secondary images
curl -X POST http://localhost:3000/file-upload \
  -H "Content-Type: multipart/form-data" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "profession=Developer" \
  -F "mainImage=@/path/to/main.jpg" \
  -F "secondaryImages=@/path/to/secondary1.jpg" \
  -F "secondaryImages=@/path/to/secondary2.jpg"

# Get file info
curl http://localhost:3000/file-upload/file/filename.jpg

# Delete file
curl -X DELETE http://localhost:3000/file-upload/file/filename.jpg
```

## 11. Key Features:

1. **Main Image Validation**: Required, max 5MB, only image types
2. **Secondary Images**: Optional, max 3 images, same validation
3. **URL Generation**: Automatic URL generation for uploaded files
4. **Additional Fields**: firstName, lastName, profession with validation
5. **File Cleanup**: Automatic cleanup on error
6. **File Management**: Get and delete endpoints
7. **Static File Serving**: Files accessible via URLs

## 12. Environment Configuration (.env):

```env
APP_URL=http://localhost:3000
NODE_ENV=development
PORT=3000
```

## 13. Package.json Scripts:

Add to your package.json:
```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main"
  }
}
```

This implementation provides a complete, production-ready file upload system with all your requirements met. The system is modular, well-validated, and includes proper error handling and cleanup.