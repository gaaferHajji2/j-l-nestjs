import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/users-param.dto';

@Controller('users')
export class UsersController {
  // Note: If we don't set 'id' with param then id will become an object
  @Get('/:id')
  public getUserById(@Param() t1: GetUsersParamDto) {
    return {
      type_: typeof t1,
      id: t1,
      name: 'JLoka-01',
      job: 'ITE Developer',
    };
  }

  // To avoid the parsing errors of ts
  @Get('/')
  public getUsers() {
    return {
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
