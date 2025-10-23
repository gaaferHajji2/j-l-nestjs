/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUsersParamDto } from './dtos/users-param.dto';
import { UpdateUserPartDTO } from './dtos/update-user-part.dto';
import { UsersService } from './users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({
    summary: 'Get list of users',
  })
  @ApiResponse({
    status: 200,
    description: 'Return success result with list of users',
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The limit of returned values',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description: 'The current page of returned results',
    example: 1,
  })
  public getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    console.log(`limit is: ${limit}, page is: ${page}`);
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
