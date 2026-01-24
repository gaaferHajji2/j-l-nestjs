import { 
  Controller, 
  Post, 
  UseInterceptors, 
  UploadedFiles, 
  Body, 
  BadRequestException,
  Get,
  Param,
  Delete
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './services/file-upload.service';
import { FileUploadValidator } from './validation/file-upload-validator';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UploadResponseDto } from './dto/upload-response.dto';
import { multerOptions } from '../config/multer.config';

@Controller('file-upload')
export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
    private readonly fileUploadValidator: FileUploadValidator,
  ) {}

  @Post()
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
  async getFileInfo(@Param('filename') filename: string) {
    const fileInfo = await this.fileUploadService.getFileInfo(filename);
    if (!fileInfo) {
      throw new BadRequestException('File not found');
    }
    return fileInfo;
  }

  @Delete('file/:filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.fileUploadService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
