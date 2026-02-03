 I'll create a comprehensive NestJS with MongoDB sample project for you. This will be a complete, production-ready example with all the features you requested.

## Project Structure

```
nestjs-mongodb-sample/
├── package.json
├── tsconfig.json
├── nest-cli.json
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   └── database.config.ts
│   ├── modules/
│   │   └── library/                    # Example: Library Management System
│   │       ├── library.module.ts
│   │       ├── controllers/
│   │       │   ├── author.controller.ts
│   │       │   ├── book.controller.ts
│   │       │   └── category.controller.ts
│   │       ├── services/
│   │       │   ├── author.service.ts
│   │       │   ├── book.service.ts
│   │       │   └── category.service.ts
│   │       ├── schemas/
│   │       │   ├── author.schema.ts
│   │       │   ├── book.schema.ts
│   │       │   └── category.schema.ts
│   │       ├── dto/
│   │       │   ├── create-author.dto.ts
│   │       │   ├── update-author.dto.ts
│   │       │   ├── create-book.dto.ts
│   │       │   ├── update-book.dto.ts
│   │       │   ├── create-category.dto.ts
│   │       │   └── update-category.dto.ts
│   │       └── interfaces/
│   │           └── populate-options.interface.ts
│   └── shared/
│       └── decorators/
│           └── populate.decorator.ts
└── docker-compose.yml (optional for MongoDB)
```

## 1. Installation Commands

```bash
# Create new NestJS project
npm i -g @nestjs/cli@10.3.2
nest new nestjs-mongodb-sample

cd nestjs-mongodb-sample

# Core NestJS packages
npm install @nestjs/common@10.3.3 \
            @nestjs/core@10.3.3 \
            @nestjs/platform-express@10.3.3 \
            @nestjs/config@3.2.0 \
            @nestjs/mongoose@10.0.4 \
            @nestjs/swagger@7.3.0 \
            reflect-metadata@0.2.1 \
            rxjs@7.8.1

# MongoDB & Mongoose
npm install mongoose@8.2.0

# Validation & Transformation
npm install class-validator@0.14.1 \
            class-transformer@0.5.1

# Utilities
npm install @types/node@20.11.24 \
            typescript@5.3.3

# Development dependencies
npm install -D @nestjs/testing@10.3.3 \
               @types/express@4.17.21 \
               @typescript-eslint/eslint-plugin@7.1.0 \
               @typescript-eslint/parser@7.1.0 \
               eslint@8.57.0 \
               jest@29.7.0 \
               prettier@3.2.5 \
               ts-node@10.9.2 \
               tsconfig-paths@4.2.0
```

## 2. Main Application Files

### `src/main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Library Management API')
    .setDescription('NestJS + MongoDB with Dynamic Population')
    .setVersion('1.0')
    .addTag('Library')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Enable CORS
  app.enableCors();

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger docs: http://localhost:3000/api/docs`);
}
bootstrap();
```

### `src/app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LibraryModule } from './modules/library/library.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/library_db',
      }),
      inject: [ConfigService],
    }),
    LibraryModule,
  ],
})
export class AppModule {}
```

### `.env`
```env
MONGODB_URI=mongodb://localhost:27017/library_db
PORT=3000
```

## 3. Schemas (Separated Files)

### `src/modules/library/schemas/category.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
```

### `src/modules/library/schemas/author.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from './category.schema';

export type AuthorDocument = HydratedDocument<Author>;

@Schema({ timestamps: true })
export class Author {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ unique: true, sparse: true })
  email: string;

  @Prop()
  biography: string;

  @Prop({ type: Date })
  birthDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  specializations: Category[];

  @Prop({ default: true })
  isActive: boolean;
}

export const AuthorSchema = SchemaFactory.createForClass(Author);
```

### `src/modules/library/schemas/book.schema.ts`
```typescript
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Author } from './author.schema';
import { Category } from './category.schema';

export type BookDocument = HydratedDocument<Book>;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  isbn: string;

  @Prop()
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ type: Date })
  publishedDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Author', required: true })
  author: Author;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Category' }] })
  categories: Category[];

  @Prop({ default: 0, min: 0 })
  stockQuantity: number;

  @Prop({ default: true })
  isAvailable: boolean;

  @Prop({ type: [{ 
    userId: String, 
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }] })
  reviews: Array<{
    userId: string;
    rating: number;
    comment: string;
    createdAt: Date;
  }>;
}

export const BookSchema = SchemaFactory.createForClass(Book);
```

## 4. DTOs (Separated Files)

### `src/modules/library/dto/create-category.dto.ts`
```typescript
import { IsString, IsOptional, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Science Fiction', description: 'Category name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Books about futuristic concepts', description: 'Category description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

### `src/modules/library/dto/update-category.dto.ts`
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
```

### `src/modules/library/dto/create-author.dto.ts`
```typescript
import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsEmail, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAuthorDto {
  @ApiProperty({ example: 'John', description: 'Author first name' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Author last name' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiPropertyOptional({ example: 'john.doe@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Renowned science fiction writer...' })
  @IsString()
  @IsOptional()
  biography?: string;

  @ApiPropertyOptional({ example: '1970-01-01' })
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @ApiPropertyOptional({ example: ['65d4f1a2b3c4d5e6f7g8h9i0'], description: 'Category IDs' })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  specializations?: string[];

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
```

### `src/modules/library/dto/update-author.dto.ts`
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateAuthorDto } from './create-author.dto';

export class UpdateAuthorDto extends PartialType(CreateAuthorDto) {}
```

### `src/modules/library/dto/create-book.dto.ts`
```typescript
import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsNumber, IsDateString, IsArray, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateBookDto {
  @ApiProperty({ example: 'The Great Adventure', description: 'Book title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '978-3-16-148410-0', description: 'ISBN number' })
  @IsString()
  @IsNotEmpty()
  isbn: string;

  @ApiPropertyOptional({ example: 'An exciting journey through...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 29.99, description: 'Book price' })
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsDateString()
  @IsOptional()
  publishedDate?: Date;

  @ApiProperty({ example: '65d4f1a2b3c4d5e6f7g8h9i0', description: 'Author ID' })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiPropertyOptional({ example: ['65d4f1a2b3c4d5e6f7g8h9i0', '65d4f1a2b3c4d5e6f7g8h9i1'], description: 'Category IDs' })
  @IsArray()
  @IsOptional()
  @Type(() => String)
  categories?: string[];

  @ApiPropertyOptional({ example: 100, default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  @Type(() => Number)
  stockQuantity?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
```

### `src/modules/library/dto/update-book.dto.ts`
```typescript
import { PartialType } from '@nestjs/swagger';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
```

### `src/modules/library/dto/query-book.dto.ts`
```typescript
import { IsOptional, IsString, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryBookDto {
  @ApiPropertyOptional({ description: 'Populate author details', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  populateAuthor?: string;

  @ApiPropertyOptional({ description: 'Populate categories', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  populateCategories?: string;

  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;
}
```

## 5. Population Interface & Decorator

### `src/modules/library/interfaces/populate-options.interface.ts`
```typescript
export interface PopulateOptions {
  path: string;
  select?: string;
  model?: string;
  populate?: PopulateOptions | PopulateOptions[];
}
```

### `src/shared/decorators/populate.decorator.ts`
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface PopulateConfig {
  [key: string]: boolean | PopulateConfig;
}

export const Populate = createParamDecorator(
  (data: PopulateConfig, ctx: ExecutionContext): PopulateConfig => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;
    
    // Parse populate parameters from query string
    const populateConfig: PopulateConfig = {};
    
    Object.keys(data).forEach(key => {
      if (query[`populate${key.charAt(0).toUpperCase() + key.slice(1)}`] === 'true') {
        populateConfig[key] = true;
      }
    });
    
    return populateConfig;
  },
);
```

## 6. Services with Dynamic Population

### `src/modules/library/services/category.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryModel.findById(id).exec();
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.categoryModel
      .findByIdAndUpdate(id, updateCategoryDto, { new: true })
      .exec();
    
    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }
  }
}
```

### `src/modules/library/services/author.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Author, AuthorDocument } from '../schemas/author.schema';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel(Author.name) private authorModel: Model<AuthorDocument>,
  ) {}

  async create(createAuthorDto: CreateAuthorDto): Promise<Author> {
    const createdAuthor = new this.authorModel(createAuthorDto);
    return createdAuthor.save();
  }

  async findAll(populateSpecializations = false): Promise<Author[]> {
    let query = this.authorModel.find();
    
    if (populateSpecializations) {
      query = query.populate('specializations');
    }
    
    return query.exec();
  }

  async findOne(id: string, populateSpecializations = false): Promise<Author> {
    let query = this.authorModel.findById(id);
    
    if (populateSpecializations) {
      query = query.populate('specializations');
    }
    
    const author = await query.exec();
    
    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }
    return author;
  }

  async update(id: string, updateAuthorDto: UpdateAuthorDto): Promise<Author> {
    const author = await this.authorModel
      .findByIdAndUpdate(id, updateAuthorDto, { new: true })
      .exec();
    
    if (!author) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }
    return author;
  }

  async remove(id: string): Promise<void> {
    const result = await this.authorModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Author with ID "${id}" not found`);
    }
  }
}
```

### `src/modules/library/services/book.service.ts`
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../schemas/book.schema';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';

interface PopulateConfig {
  author?: boolean;
  categories?: boolean;
}

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name) private bookModel: Model<BookDocument>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(populateConfig: PopulateConfig = {}): Promise<Book[]> {
    let query = this.bookModel.find();

    // Dynamic population based on configuration
    if (populateConfig.author) {
      query = query.populate({
        path: 'author',
        populate: {
          path: 'specializations',
          model: 'Category'
        }
      });
    }

    if (populateConfig.categories) {
      query = query.populate('categories');
    }

    return query.exec();
  }

  async findOne(id: string, populateConfig: PopulateConfig = {}): Promise<Book> {
    let query = this.bookModel.findById(id);

    // Dynamic population based on configuration
    if (populateConfig.author) {
      query = query.populate({
        path: 'author',
        select: '-__v', // Exclude version key
        populate: {
          path: 'specializations',
          model: 'Category',
          select: 'name description'
        }
      });
    }

    if (populateConfig.categories) {
      query = query.populate({
        path: 'categories',
        select: 'name description'
      });
    }

    const book = await query.exec();

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  async findByAuthor(authorId: string, populateConfig: PopulateConfig = {}): Promise<Book[]> {
    let query = this.bookModel.find({ author: authorId });

    if (populateConfig.categories) {
      query = query.populate('categories');
    }

    return query.exec();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const book = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }

  async remove(id: string): Promise<void> {
    const result = await this.bookModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
  }

  // Advanced query with full population chain
  async findWithFullDetails(id: string): Promise<Book> {
    const book = await this.bookModel
      .findById(id)
      .populate({
        path: 'author',
        populate: {
          path: 'specializations',
          model: 'Category'
        }
      })
      .populate('categories')
      .exec();

    if (!book) {
      throw new NotFoundException(`Book with ID "${id}" not found`);
    }
    return book;
  }
}
```

## 7. Controllers with Routes

### `src/modules/library/controllers/category.controller.ts`
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../schemas/category.schema';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({ status: 201, description: 'Category created successfully', type: Category })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Return all categories', type: [Category] })
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 200, description: 'Return the category', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({ status: 200, description: 'Category updated successfully', type: Category })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
```

### `src/modules/library/controllers/author.controller.ts`
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { AuthorService } from '../services/author.service';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { Author } from '../schemas/author.schema';

@ApiTags('Authors')
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
```

### `src/modules/library/controllers/book.controller.ts`
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { BookService } from '../services/book.service';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { QueryBookDto } from '../dto/query-book.dto';
import { Book } from '../schemas/book.schema';

@ApiTags('Books')
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
```

## 8. Module Configuration

### `src/modules/library/library.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './controllers/category.controller';
import { AuthorController } from './controllers/author.controller';
import { BookController } from './controllers/book.controller';
import { CategoryService } from './services/category.service';
import { AuthorService } from './services/author.service';
import { BookService } from './services/book.service';
import { Category, CategorySchema } from './schemas/category.schema';
import { Author, AuthorSchema } from './schemas/author.schema';
import { Book, BookSchema } from './schemas/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Author.name, schema: AuthorSchema },
      { name: Book.name, schema: BookSchema },
    ]),
  ],
  controllers: [CategoryController, AuthorController, BookController],
  providers: [CategoryService, AuthorService, BookService],
  exports: [CategoryService, AuthorService, BookService],
})
export class LibraryModule {}
```

## 9. Docker Compose (Optional)

### `docker-compose.yml`
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:7.0
    container_name: library-mongodb
    restart: always
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password123
      MONGO_INITDB_DATABASE: library_db
    volumes:
      - mongodb_data:/data/db

  mongo-express:
    image: mongo-express:1.0.2
    container_name: library-mongo-express
    restart: always
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_ADMINUSERNAME: admin
      ME_CONFIG_MONGODB_ADMINPASSWORD: password123
      ME_CONFIG_MONGODB_URL: mongodb://admin:password123@mongodb:27017/
    depends_on:
      - mongodb

volumes:
  mongodb_data:
```

## 10. Request Body Examples for API Testing

### Create Category
```json
POST /categories
{
  "name": "Science Fiction",
  "description": "Futuristic and speculative fiction",
  "isActive": true
}
```

### Create Author
```json
POST /authors
{
  "firstName": "Isaac",
  "lastName": "Asimov",
  "email": "isaac.asimov@example.com",
  "biography": "Renowned science fiction writer and professor of biochemistry",
  "birthDate": "1920-01-02",
  "specializations": ["65d4f1a2b3c4d5e6f7g8h9i0"], // Category IDs
  "isActive": true
}
```

### Create Book
```json
POST /books
{
  "title": "Foundation",
  "isbn": "978-0-553-29335-7",
  "description": "The first novel in the Foundation series",
  "price": 15.99,
  "publishedDate": "1951-06-01",
  "author": "65d4f1a2b3c4d5e6f7g8h9i0", // Author ID
  "categories": ["65d4f1a2b3c4d5e6f7g8h9i0"], // Category IDs
  "stockQuantity": 50,
  "isAvailable": true
}
```

## Usage Examples

### Population Examples

**Get book without population (default):**
```http
GET /books/65d4f1a2b3c4d5e6f7g8h9i0
```
Response: Book with author and categories as ObjectIds

**Get book with populated author:**
```http
GET /books/65d4f1a2b3c4d5e6f7g8h9i0?populateAuthor=true
```
Response: Book with full author object (including their specializations)

**Get book with all relations:**
```http
GET /books/65d4f1a2b3c4d5e6f7g8h9i0?populateAuthor=true&populateCategories=true
```
Response: Book with full author and categories arrays

**Get book with full details (convenience endpoint):**
```http
GET /books/65d4f1a2b3c4d5e6f7g8h9i0/full-details
```
Response: Book with all nested relations populated

## Running the Application

```bash
# Start MongoDB
docker-compose up -d

# Install dependencies
npm install

# Run in development mode
npm run start:dev

# Or build and run production
npm run build
npm run start:prod
```

This implementation features:

1. **Three related models**: Category → Author (specializations) → Book (author + categories)
2. **Dynamic population**: Relations populated only when explicitly requested via query parameters
3. **Clean separation**: Schemas, DTOs, Controllers, and Services in separate files
4. **Full CRUD**: Complete REST API with validation
5. **Swagger docs**: Auto-generated API documentation at `/api/docs`
6. **Type safety**: Full TypeScript support with proper decorators
7. **Flexible queries**: Population controlled per-request to optimize performance