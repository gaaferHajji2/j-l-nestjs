import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UsersController {
  @Get('/')
  public getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(`The limit is: ${limit}, and page is: ${page}`);
    return [
      { name: 'JLoka-01', job: 'Web Developer' },
      { name: 'JLoka-02', job: 'Mobile App Developer' },
    ];
  }

  // Note: If we don't set 'id' with param then id will become an object
  @Get('/:id')
  public getUserById(@Param('id', ParseIntPipe) id: number) {
    // console.log(`The id is: ${id}`);
    return {
      type_: typeof id,
      id: id,
      name: 'JLoka-01',
      job: 'ITE Developer',
    };
  }

  @Post('/')
  public createNewUser(@Body() userDto: CreateUserDto) {
    console.log(`The data is: ${JSON.stringify(userDto)}`);
    console.log(typeof userDto); // Object
    console.log(userDto instanceof CreateUserDto); // true, but without transformer: true in global pipe, it will be: false
    return { msg: 'User Created Successfully' };
  }
}
