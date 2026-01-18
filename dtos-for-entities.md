# DTO Files for NestJS TypeORM Entities with Validation

## Installation
```bash
npm install class-validator class-transformer
```

## User DTOs

### 1. Create User DTOs
```bash
mkdir -p src/user/dto
```

#### Create User DTO
```typescript
// src/user/dto/create-user.dto.ts
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProfileDto } from '../../profile/dto/create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'User profile (optional)',
    type: () => CreateProfileDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile?: CreateProfileDto;
}
```

#### Update User DTO
```typescript
// src/user/dto/update-user.dto.ts
import {
  IsEmail,
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'User email address',
    example: 'john.updated@example.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe Updated',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string;
}
```

#### User Response DTO
```typescript
// src/user/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { ProfileResponseDto } from '../../profile/dto/profile-response.dto';
import { PostResponseDto } from '../../post/dto/post-response.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'User ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @Expose()
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @Expose()
  lastName: string;

  @ApiProperty({
    description: 'User active status',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
  })
  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @ApiProperty({
    description: 'User profile',
    type: () => ProfileResponseDto,
    required: false,
  })
  @Expose()
  @Type(() => ProfileResponseDto)
  profile?: ProfileResponseDto;

  @ApiProperty({
    description: 'User posts',
    type: () => [PostResponseDto],
    required: false,
  })
  @Expose()
  @Type(() => PostResponseDto)
  posts?: PostResponseDto[];

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;

  @Exclude()
  password?: string;
}
```

## Profile DTOs

### 2. Create Profile DTOs
```bash
mkdir -p src/profile/dto
```

#### Create Profile DTO
```typescript
// src/profile/dto/create-profile.dto.ts
import {
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty({
    description: 'User biography',
    example: 'Software engineer with 5 years of experience',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'Personal website URL',
    example: 'https://johndoe.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;

  @ApiProperty({
    description: 'Location',
    example: 'New York, USA',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiProperty({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  avatarUrl?: string;
}
```

#### Update Profile DTO
```typescript
// src/profile/dto/update-profile.dto.ts
import {
  IsString,
  IsOptional,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProfileDto } from './create-profile.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @ApiProperty({
    description: 'User biography',
    example: 'Updated biography',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'Personal website URL',
    example: 'https://updated-website.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(255)
  website?: string;
}
```

#### Profile Response DTO
```typescript
// src/profile/dto/profile-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ProfileResponseDto {
  @ApiProperty({
    description: 'Profile ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User biography',
    example: 'Software engineer with 5 years of experience',
    nullable: true,
  })
  @Expose()
  bio?: string;

  @ApiProperty({
    description: 'Personal website URL',
    example: 'https://johndoe.com',
    nullable: true,
  })
  @Expose()
  website?: string;

  @ApiProperty({
    description: 'Location',
    example: 'New York, USA',
    nullable: true,
  })
  @Expose()
  location?: string;

  @ApiProperty({
    description: 'Avatar image URL',
    example: 'https://example.com/avatar.jpg',
    nullable: true,
  })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Associated user ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  userId: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
```

## Post DTOs

### 3. Create Post DTOs
```bash
mkdir -p src/post/dto
```

#### Create Post DTO
```typescript
// src/post/dto/create-post.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to NestJS...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Whether the post is published',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Author ID (User ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  authorId: string;

  @ApiProperty({
    description: 'Array of category IDs',
    example: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
```

#### Update Post DTO
```typescript
// src/post/dto/update-post.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  ArrayUnique,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'Post title',
    example: 'Updated Title',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'Updated content...',
    required: false,
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({
    description: 'Whether the post is published',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Array of category IDs to replace existing ones',
    example: ['550e8400-e29b-41d4-a716-446655440004'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds?: string[];
}
```

#### Post Response DTO
```typescript
// src/post/dto/post-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { CategoryResponseDto } from '../../category/dto/category-response.dto';

export class PostResponseDto {
  @ApiProperty({
    description: 'Post ID',
    example: '550e8400-e29b-41d4-a716-446655440010',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Post title',
    example: 'Getting Started with NestJS',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'Post content',
    example: 'This is a comprehensive guide to NestJS...',
  })
  @Expose()
  content: string;

  @ApiProperty({
    description: 'Whether the post is published',
    example: false,
  })
  @Expose()
  isPublished: boolean;

  @ApiProperty({
    description: 'Author information',
    type: () => UserResponseDto,
  })
  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @ApiProperty({
    description: 'Author ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Expose()
  authorId: string;

  @ApiProperty({
    description: 'Categories assigned to the post',
    type: () => [CategoryResponseDto],
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
```

## Category DTOs

### 4. Create Category DTOs
```bash
mkdir -p src/category/dto
```

#### Create Category DTO
```typescript
// src/category/dto/create-category.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Technology',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Posts about technology and programming',
    required: false,
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiProperty({
    description: 'Category active status',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
```

#### Update Category DTO
```typescript
// src/category/dto/update-category.dto.ts
import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Category name',
    example: 'Updated Category Name',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Updated description',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
```

#### Category Response DTO
```typescript
// src/category/dto/category-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PostResponseDto } from '../../post/dto/post-response.dto';

export class CategoryResponseDto {
  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Technology',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Posts about technology and programming',
    nullable: true,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Category active status',
    example: true,
  })
  @Expose()
  isActive: boolean;

  @ApiProperty({
    description: 'Posts in this category',
    type: () => [PostResponseDto],
    required: false,
  })
  @Expose()
  @Type(() => PostResponseDto)
  posts?: PostResponseDto[];

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
```

## Tag Entity and DTOs (Additional Many-to-Many Example)

### 5. Create Tag Entity and DTOs

#### Generate Tag Module
```bash
nest generate module tag
nest generate service tag
```

#### Tag Entity
```typescript
// src/tag/tag.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: '#007bff' })
  color: string;

  // Many-to-Many with Post (posts can have many tags)
  @ManyToMany(() => Post, (post) => post.tags)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Update Post Entity to include Tags
```typescript
// src/post/post.entity.ts (updated)
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';

@Entity('posts')
export class Post {
  // ... existing properties ...

  // Many-to-Many with Category (existing)
  @ManyToMany(() => Category, (category) => category.posts, {
    cascade: true,
  })
  @JoinTable({
    name: 'post_categories',
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'categoryId',
      referencedColumnName: 'id',
    },
  })
  categories: Category[];

  // Many-to-Many with Tag (new relationship)
  @ManyToMany(() => Tag, (tag) => tag.posts, {
    cascade: true,
    eager: false, // Set to true if you always want to load tags
  })
  @JoinTable({
    name: 'post_tags', // New junction table
    joinColumn: {
      name: 'postId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tagId',
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  // ... rest of the entity ...
}
```

#### Post Tags Junction DTOs

```typescript
// src/post/dto/post-tag.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsArray, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class AssignTagsToPostDto {
  @ApiProperty({
    description: 'Array of tag IDs to assign to the post',
    example: ['550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440021'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds: string[];
}

export class RemoveTagsFromPostDto {
  @ApiProperty({
    description: 'Array of tag IDs to remove from the post',
    example: ['550e8400-e29b-41d4-a716-446655440020'],
    type: [String],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds: string[];
}
```

#### Tag DTOs

```typescript
// src/tag/dto/create-tag.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsHexColor,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag name',
    example: 'nestjs',
    minLength: 2,
    maxLength: 30,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Posts related to NestJS framework',
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    description: 'Tag color in hex format',
    example: '#007bff',
    required: false,
    default: '#007bff',
  })
  @IsOptional()
  @IsString()
  @IsHexColor()
  color?: string;
}
```

```typescript
// src/tag/dto/tag-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TagResponseDto {
  @ApiProperty({
    description: 'Tag ID',
    example: '550e8400-e29b-41d4-a716-446655440020',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Tag name',
    example: 'nestjs',
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'Tag description',
    example: 'Posts related to NestJS framework',
    nullable: true,
  })
  @Expose()
  description?: string;

  @ApiProperty({
    description: 'Tag color',
    example: '#007bff',
  })
  @Expose()
  color: string;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @Expose()
  updatedAt: Date;
}
```

## Update Post DTOs with Tags

```typescript
// src/post/dto/create-post.dto.ts (updated)
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
  ArrayNotEmpty,
  ArrayUnique,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  // ... existing properties ...

  @ApiProperty({
    description: 'Array of category IDs',
    example: ['550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440003'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  categoryIds?: string[];

  @ApiProperty({
    description: 'Array of tag IDs',
    example: ['550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440021'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsUUID('4', { each: true })
  tagIds?: string[];
}
```

```typescript
// src/post/dto/post-response.dto.ts (updated)
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../user/dto/user-response.dto';
import { CategoryResponseDto } from '../../category/dto/category-response.dto';
import { TagResponseDto } from '../../tag/dto/tag-response.dto';

export class PostResponseDto {
  // ... existing properties ...

  @ApiProperty({
    description: 'Categories assigned to the post',
    type: () => [CategoryResponseDto],
  })
  @Expose()
  @Type(() => CategoryResponseDto)
  categories: CategoryResponseDto[];

  @ApiProperty({
    description: 'Tags assigned to the post',
    type: () => [TagResponseDto],
  })
  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  // ... rest of the DTO ...
}
```

## Global Validation Pipe Setup

```typescript
// src/main.ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if non-whitelisted properties are present
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  
  await app.listen(3000);
}
bootstrap();
```

## Updated Controller Example with Validation

```typescript
// src/user/user.controller.ts (updated)
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UserResponseDto,
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.userService.remove(id);
  }
}
```

## Summary of DTO Relationships

1. **One-to-One** (User ↔ Profile):
   - User can have one optional Profile
   - Profile must have one required User

2. **One-to-Many** (User ↔ Post):
   - User can have many Posts
   - Post must have one required User (author)

3. **Many-to-Many** (Post ↔ Category):
   - Post can have many optional Categories
   - Category can have many optional Posts

4. **Many-to-Many** (Post ↔ Tag):
   - Post can have many optional Tags
   - Tag can have many optional Posts

All DTOs include:
- Class-validator decorators for input validation
- Class-transformer decorators for response serialization
- ApiProperty decorators for Swagger documentation
- Proper type definitions and examples
- Optional/required field specifications
- UUID validation for relationship IDs
- Array validations for many-to-many relationships