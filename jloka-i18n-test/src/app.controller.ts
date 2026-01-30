import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { I18nValidationPipe } from 'nestjs-i18n';
import { CreateUserDto } from './dto/test.dto';

@Controller()
export class AppController {
  constructor() {}
  
  @Post()
  @UsePipes(I18nValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: createUserDto,
    };
  }
}
