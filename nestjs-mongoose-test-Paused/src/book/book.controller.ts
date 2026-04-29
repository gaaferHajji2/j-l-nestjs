import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from './schemas/book.schema';
import { QueryBookDto } from './dto/query-book.dto';
import { CreateBookDto } from './dto/create-book.dto';
import { BookService } from './book.service';
@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book' })
  @ApiBody({ type: CreateBookDto })
  @ApiResponse({ status: 201, description: 'Book created successfully', type: Book })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createBookDto: CreateBookDto): Promise<Book> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all books with optional population' })
  @ApiQuery({ name: 'populateAuthor', required: false, type: Boolean, description: 'Include author details' })
  @ApiQuery({ name: 'populateCategories', required: false, type: Boolean, description: 'Include category details' })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search by title' })
  @ApiResponse({ status: 200, description: 'Return all books', type: [Book] })
  async findAll(@Query() query: QueryBookDto): Promise<Book[]> {
    const populateConfig = {
      author: query.populateAuthor === 'true',
      categories: query.populateCategories === 'true',
    };
    return this.bookService.findAll(populateConfig);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get book by ID with optional population' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiQuery({ name: 'populateAuthor', required: false, type: Boolean, description: 'Include author details and their specializations' })
  @ApiQuery({ name: 'populateCategories', required: false, type: Boolean, description: 'Include category details' })
  @ApiResponse({ status: 200, description: 'Return the book', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findOne(
    @Param('id') id: string,
    @Query() query: QueryBookDto,
  ): Promise<Book> {
    const populateConfig = {
      author: query.populateAuthor === 'true',
      categories: query.populateCategories === 'true',
    };
    return this.bookService.findOne(id, populateConfig);
  }

  @Get(':id/full-details')
  @ApiOperation({ summary: 'Get book with all relations populated (convenience endpoint)' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 200, description: 'Return book with full details', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async findWithFullDetails(@Param('id') id: string): Promise<Book> {
    return this.bookService.findWithFullDetails(id);
  }

  @Get('author/:authorId')
  @ApiOperation({ summary: 'Get books by author ID' })
  @ApiParam({ name: 'authorId', description: 'Author ID' })
  @ApiQuery({ name: 'populateCategories', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Return books by author', type: [Book] })
  async findByAuthor(
    @Param('authorId') authorId: string,
    @Query('populateCategories') populateCategories?: string,
  ): Promise<Book[]> {
    return this.bookService.findByAuthor(authorId, {
      categories: populateCategories === 'true',
    });
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiBody({ type: UpdateBookDto })
  @ApiResponse({ status: 200, description: 'Book updated successfully', type: Book })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<Book> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete book by ID' })
  @ApiParam({ name: 'id', description: 'Book ID' })
  @ApiResponse({ status: 204, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.bookService.remove(id);
  }
}