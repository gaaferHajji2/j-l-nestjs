import { Body, Controller, Get, Post, UseFilters, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto/test.dto';
import { JI18nValidationPipe } from './pipes/i18n-validation.pipe';
import { I18n, I18nContext, I18nValidationExceptionFilter } from 'nestjs-i18n';

@Controller()
export class AppController {
  constructor() {}

  @Post()
  //@UsePipes(JI18nValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: createUserDto,
    };
  }

  @Get()
  getAbout(@I18n() i18n: I18nContext){
    return i18n.t('validation.IS_STRING')
  }
}
