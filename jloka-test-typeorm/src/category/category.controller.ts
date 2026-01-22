import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {

    constructor(private readonly categoryService: CategoryService) {}

    @Get('/')
    @HttpCode(HttpStatus.OK)
    async getAllCatgeories() {
        return this.categoryService.findAll()
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    async getCategoryById(@Param('id') id: string) {
        return this.categoryService.findOne(id)
    }

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    async createNewCategory(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto)
    }

    @Put('/:id')
    @HttpCode(HttpStatus.OK)
    async updateCatgeoryById(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto)
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCategoryById(@Param('id') id: string) {
        return this.categoryService.remove(id)
    }

    @Get('/popular/:limit')
    @HttpCode(HttpStatus.OK)
    async getPopularCategory(@Param('limit') limit: number = 10) {
        return this.categoryService.getPopularCategories(limit)
    }

    @Get('/search/:searchTerm')
    async searchForCatgeoryByTerm(@Param('searchTerm') searchTerm: string) {
        return this.categoryService.searchCategories(searchTerm)
    }
}