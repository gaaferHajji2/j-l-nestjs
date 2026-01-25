import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      fileFilter: (req, file, cb) => {
        const t1 = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
        if(t1.includes(file.mimetype)) {
          const maxSize = 2 * 1024 * 1024;
          if(file.size > maxSize) {
            console.log("The size is > 2MB")
            cb(null, false)
          } else {
            cb(null, true)
          }
        } else {
          console.log("Not in type")
          cb(null, false)
        }
      },
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`
          cb(null, filename)
        },
      }),
    }),
  ],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
