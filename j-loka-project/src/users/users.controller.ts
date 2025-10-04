import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get('/')
  public getUsers(
    @Query('limit', ParseIntPipe) limit: number,
    @Query('page', ParseIntPipe) page: number,
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
  public createNewUser(@Body() data, @Headers() headers) {
    console.log(`The data is: ${JSON.stringify(data)}`);
    console.log('headers are: ', headers);
    return { msg: 'User Created Successfully' };
  }
}
