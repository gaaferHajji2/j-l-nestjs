import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/user/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: { name: string; email: string }) {
    return this.usersService.createUser(createUserDto.name, createUserDto.email);
  }

  // in this way we can use supported way to paths: *, by adding *path where path is the prefix
  // here the path is $
  @Get('/loka/*$')
  getLoka() {
    return "My name is: Jafar Loka";
  }

  @Get('/user')
  getLokaUser(@User() user) {
    return user
  }
}