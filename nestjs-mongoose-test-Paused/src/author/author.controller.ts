import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { AuthorService } from './author.service';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateAuthorDto } from './dto/create-author.dto';
import { Author } from './schemas/author.schema';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author' })
  @ApiBody({ type: CreateAuthorDto })
  @ApiResponse({ status: 201, description: 'Author created successfully', type: Author })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createAuthorDto: CreateAuthorDto): Promise<Author> {
    return this.authorService.create(createAuthorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors' })
  @ApiQuery({ name: 'populateSpecializations', required: false, type: Boolean, description: 'Include specialization categories' })
  @ApiResponse({ status: 200, description: 'Return all authors', type: [Author] })
  async findAll(
    @Query('populateSpecializations') populateSpecializations?: string,
  ): Promise<Author[]> {
    return this.authorService.findAll(populateSpecializations === 'true');
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiQuery({ name: 'populateSpecializations', required: false, type: Boolean, description: 'Include specialization categories' })
  @ApiResponse({ status: 200, description: 'Return the author', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async findOne(
    @Param('id') id: string,
    @Query('populateSpecializations') populateSpecializations?: string,
  ): Promise<Author> {
    return this.authorService.findOne(id, populateSpecializations === 'true');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiBody({ type: UpdateAuthorDto })
  @ApiResponse({ status: 200, description: 'Author updated successfully', type: Author })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAuthorDto: UpdateAuthorDto,
  ): Promise<Author> {
    return this.authorService.update(id, updateAuthorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete author by ID' })
  @ApiParam({ name: 'id', description: 'Author ID' })
  @ApiResponse({ status: 204, description: 'Author deleted successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.authorService.remove(id);
  }
}