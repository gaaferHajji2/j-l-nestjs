import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // eslint-disable-next-line prettier/prettier
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
