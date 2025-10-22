/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common'
import { PostsService } from './posts.service'

@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get('/:userId')
    public getAllPostsForUser(@Param('userId') userId: string) {
        return this.postsService.getAllPostsForUser(userId);
    }

    @Get('/')
    public getAllPosts() {
        return this.postsService.getAllPosts();
    }
}
