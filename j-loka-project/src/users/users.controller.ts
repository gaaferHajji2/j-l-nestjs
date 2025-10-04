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
  public getUsers() {
    return [
      { name: 'JLoka-01', job: 'Web Developer' },
      { name: 'JLoka-02', job: 'Mobile App Developer' },
    ];
  }

  // Note: If we don't set 'id' with param then id will become an object
  @Get('/:id')
  public getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Query('sort') sort: string,
  ) {
    // console.log(`The id is: ${id}`);
    return {
      type_: typeof id,
      id: id,
      name: 'JLoka-01',
      job: 'ITE Developer',
      sort,
    };
  }

  @Post('/')
  public createNewUser(@Body() data, @Headers() headers) {
    console.log(`The data is: ${JSON.stringify(data)}`);
    console.log('headers are: ', headers);
    return { msg: 'User Created Successfully' };
  }
}
