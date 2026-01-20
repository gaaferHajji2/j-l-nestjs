import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {

    constructor(private readonly postService: PostService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAllPosts() {
        return this.postService.findAll()
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getPostById(@Param('id') id: string) {
        return this.postService.findOne(id)
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async createNewPost(@Body() createPostDto: CreatePostDto) {
        return this.postService.create(createPostDto)
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updatePostById(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
        return this.postService.update(id, updatePostDto)
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePostById(@Param('id') id: string) {
        return this.postService.remove(id)
    }

    @Get('/search/:searchTerm')
    @HttpCode(HttpStatus.OK)
    async searchPostByTerm(@Param('searchTerm') searchTerm: string) {
        return this.postService.searchPosts(searchTerm)
    }
}