import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileUploadService } from './file-upload/services/file-upload.service';
import { FileUploadController } from './file-upload/file-upload.controller';
import { ConfigModule } from '@nestjs/config';
import { FileUploadValidator } from './file-upload/validation/file-upload-validator';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    },
  ), 
  ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
  })
],
  controllers: [AppController, FileUploadController],
  providers: [AppService, FileUploadService, FileUploadValidator],

})
export class AppModule { }
