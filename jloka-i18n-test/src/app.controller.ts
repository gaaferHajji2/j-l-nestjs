import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { CreateUserDto } from './dto/test.dto';
import { JI18nValidationPipe } from './pipes/i18n-validation.pipe';

@Controller()
export class AppController {
  constructor() {}

  @Post()
  @UsePipes(JI18nValidationPipe)
  createUser(@Body() createUserDto: CreateUserDto) {
    return {
      message: 'User created successfully',
      data: createUserDto,
    };
  }
}
