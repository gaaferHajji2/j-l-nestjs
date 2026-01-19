import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  public async getAllUsers() {
    return this.usersService.findAll()
  }

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  public async createNewUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  public async getUserById(@Param('id') id: string) {
    return this.usersService.findOne(id)
  }

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  public async updateUserData(@Param('id') id: string, updateUserDto: UpdateUserDto){
    return this.usersService.update(id, updateUserDto)
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeUserData(@Param('id') id: string) {
    return this.usersService.remove(id)
  }

  @Get('/search/:searchTerm')
  @HttpCode(HttpStatus.OK)
  public async searchForUsers(@Param('searchTerm') searchTerm: string) {
    return this.usersService.searchUsers(searchTerm)
  }
}
