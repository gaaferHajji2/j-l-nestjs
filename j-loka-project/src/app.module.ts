import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UsersModule } from './users/users.module'
import { PostsModule } from './posts/posts.module'
import { AuthModule } from './auth/auth.module'


@Module({
  imports: [UsersModule, PostsModule, AuthModule, TypeOrmModule.forRoot({
    type: 'postgres',
    entities: []
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
