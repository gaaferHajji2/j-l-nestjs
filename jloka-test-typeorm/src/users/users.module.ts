import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserSubscriber } from './users.subscriber';
import { Profile } from 'src/profile/profile.entity';
// import { UserSchema } from './user.schema';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [UsersService],
})
export class UsersModule {}