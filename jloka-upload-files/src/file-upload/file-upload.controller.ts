import { Controller, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.fileUploadService.handleFileUpload(file)
  }

  @Post('/upload-multiple')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'main', maxCount: 1},
      { name: 'avatar', maxCount: 1}
    ])
  )
  uploadMultipleFiles(@UploadedFiles() files: {
    main?: Express.Multer.File[], avatar?: Express.Multer.File[]
  }){
    return {
      message: 'Files uploaded successfully!',
      avatar: files.avatar?.[0].path,
      background: files.main?.[0].path,
    };
  }
}