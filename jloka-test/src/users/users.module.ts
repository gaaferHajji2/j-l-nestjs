import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCreatedListener } from './user-create.listener';

@Module({
  providers: [UsersService, UserCreatedListener],
  controllers: [UsersController]
})
export class UsersModule {}
