/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto'

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

    @Post('/')
    public createPost(@Body() createPostDto: CreatePostDto) {

    }
}
