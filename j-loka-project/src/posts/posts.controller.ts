/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { PostsService } from './posts.service'
import { CreatePostDto } from './dto/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDto } from './dto/patch-post.dto';

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

    @ApiOperation({
        summary: "Creates A New Blog Post"
    })
    @ApiResponse({
        status: 201,
        description: "201 if the post created successfully"
    })
    @Post('/')
    public createPost(@Body() createPostDto: CreatePostDto) {
        return createPostDto;
    }

    @Patch('/')
    public patchPost(@Body() patchPostDto: PatchPostDto) {
        return patchPostDto;
    }
}
