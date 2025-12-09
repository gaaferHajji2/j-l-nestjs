import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UserCacheModule } from './user-cache/user-cache.module';

@Module({
  imports: [UsersModule, EventEmitterModule.forRoot(), UserCacheModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
