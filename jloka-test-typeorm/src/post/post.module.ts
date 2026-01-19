import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { User } from 'src/users/user.entity';
import { Category } from 'src/category/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Category])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
