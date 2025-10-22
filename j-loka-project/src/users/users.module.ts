import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  // eslint-disable-next-line prettier/prettier
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // this service become available to use by other modules
})
export class UsersModule {}
