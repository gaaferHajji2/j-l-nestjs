import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';

@Module({
  // eslint-disable-next-line prettier/prettier
  controllers: [UsersController]
})
export class UsersModule {}
