/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/users-param.dto';
import { UpdateUserPartDTO } from './dtos/update-user-part.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Note: If we don't set 'id' with param then id will become an object
  @Get('/:id')
  public getUserById(@Param() t1: GetUsersParamDto) {
    return this.usersService.getUserById(t1.id);
  }

  // To avoid the parsing errors of ts
  @Get('/')
  public getUsers() {
    return this.usersService.getAllUsers();
  }

  @Post('/')
  public createNewUser(@Body() userDto: CreateUserDto) {
    console.log(`The data is: ${JSON.stringify(userDto)}`);
    console.log(typeof userDto); // Object
    console.log(userDto instanceof CreateUserDto); // true, but without transformer: true in global pipe, it will be: false
    return { msg: 'User Created Successfully' };
  }

  @Patch()
  public updateUserPart(@Body() user: UpdateUserPartDTO) {
    return user;
  }
}
