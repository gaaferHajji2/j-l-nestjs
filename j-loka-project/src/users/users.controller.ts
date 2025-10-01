import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

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
  public getUserById(@Param('id') id: number, @Query('sort') sort: string) {
    // console.log(`The id is: ${id}`);
    return { id: id, name: 'JLoka-01', job: 'ITE Developer', sort };
  }

  @Post('/')
  public createNewUser(@Body() data) {
    console.log(`The data is: ${JSON.stringify(data)}`);
    return { msg: 'User Created Successfully' };
  }
}
