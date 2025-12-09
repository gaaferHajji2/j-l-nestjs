import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() createUserDto: { name: string; email: string }) {
    return this.usersService.createUser(createUserDto.name, createUserDto.email);
  }
}