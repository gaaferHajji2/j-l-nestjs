# NestJS + TypeORM Relationships Example

## Project Setup

### 1. Initialize NestJS Project
```bash
npm i -g @nestjs/cli
nest new nestjs-typeorm-relations
cd nestjs-typeorm-relations
```

### 2. Install Dependencies
```bash
npm install @nestjs/typeorm typeorm pg  # PostgreSQL driver
npm install @nestjs/config
npm install -D @types/node
```

### 3. Configure TypeORM
Create `ormconfig.json`:
```json
{
  "type": "postgresql",
  "host": "localhost",
  "port": 5432,
  "username": "your_username",
  "password": "your_password",
  "database": "nestjs_relations",
  "entities": ["dist/**/*.entity{.ts,.js}"],
  "migrations": ["dist/migrations/*{.ts,.js}"],
  "cli": {
    "migrationsDir": "src/migrations"
  },
  "synchronize": false,
  "logging": true
}
```

### 4. Set up App Module
```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgresql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migrations',
        },
        synchronize: false,
        logging: true,
      }),
      inject: [ConfigService],
    }),
    UserModule,
    ProfileModule,
    PostModule,
    CategoryModule,
  ],
})
export class AppModule {}
```

## Entity Relationships

### 1. One-to-One Relationship (User ↔ Profile)

#### Create User Module
```bash
nest generate module user
nest generate service user
nest generate controller user
```

#### Create User Entity
```typescript
// src/user/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from '../profile/profile.entity';
import { Post } from '../post/post.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  // One-to-One with Profile
  @OneToOne(() => Profile, (profile) => profile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: Profile;

  // One-to-Many with Post
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

#### Create Profile Module
```bash
nest generate module profile
nest generate service profile
```

#### Create Profile Entity
```typescript
// src/profile/profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  avatarUrl: string;

  // One-to-One with User (inverse side)
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 2. One-to-Many Relationship (User ↔ Post)

#### Create Post Module
```bash
nest generate module post
nest generate service post
```

#### Create Post Entity
```typescript
// src/post/post.entity.ts
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

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isPublished: boolean;

  // Many-to-One with User
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column()
  authorId: string;

  // Many-to-Many with Category
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### 3. Many-to-Many Relationship (Post ↔ Category)

#### Create Category Module
```bash
nest generate module category
nest generate service category
```

#### Create Category Entity
```typescript
// src/category/category.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from '../post/post.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  // Many-to-Many with Post (inverse side)
  @ManyToMany(() => Post, (post) => post.categories)
  posts: Post[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

## Creating Migrations

### 1. Install TypeORM CLI globally
```bash
npm install -g typeorm
```

### 2. Create Migration
```bash
# Generate migration file
typeorm migration:generate -n CreateRelationsTables

# Or create empty migration manually
typeorm migration:create -n CreateRelationsTables
```

### 3. Migration File Example
```typescript
// src/migrations/1691234567890-CreateRelationsTables.ts
import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateRelationsTables1691234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create users table
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'firstName',
            type: 'varchar',
          },
          {
            name: 'lastName',
            type: 'varchar',
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create profiles table
    await queryRunner.createTable(
      new Table({
        name: 'profiles',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'bio',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'website',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'avatarUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'userId',
            type: 'uuid',
            isUnique: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create posts table
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'content',
            type: 'text',
          },
          {
            name: 'isPublished',
            type: 'boolean',
            default: false,
          },
          {
            name: 'authorId',
            type: 'uuid',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create categories table
    await queryRunner.createTable(
      new Table({
        name: 'categories',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create junction table for many-to-many relationship
    await queryRunner.createTable(
      new Table({
        name: 'post_categories',
        columns: [
          {
            name: 'postId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'categoryId',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
      true,
    );

    // Create foreign keys
    await queryRunner.createForeignKey(
      'profiles',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['authorId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_categories',
      new TableForeignKey({
        columnNames: ['postId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'post_categories',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onDelete: 'CASCADE',
      }),
    );

    // Create indexes
    await queryRunner.createIndex('users', new TableIndex({
      name: 'IDX_USERS_EMAIL',
      columnNames: ['email'],
    }));

    await queryRunner.createIndex('posts', new TableIndex({
      name: 'IDX_POSTS_AUTHOR_ID',
      columnNames: ['authorId'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    const profileTable = await queryRunner.getTable('profiles');
    const profileForeignKey = profileTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('userId') !== -1,
    );
    if (profileForeignKey) {
      await queryRunner.dropForeignKey('profiles', profileForeignKey);
    }

    // Drop tables in reverse order
    await queryRunner.dropTable('post_categories');
    await queryRunner.dropTable('posts');
    await queryRunner.dropTable('categories');
    await queryRunner.dropTable('profiles');
    await queryRunner.dropTable('users');
  }
}
```

### 4. Run Migration
```bash
# Run migration
typeorm migration:run

# Revert migration
typeorm migration:revert

# Show migration status
typeorm migration:show
```

## Repository and Service Examples

### User Service with Relations
```typescript
// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from '../profile/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    
    // Create profile along with user
    if (createUserDto.profile) {
      user.profile = this.profileRepository.create(createUserDto.profile);
    }
    
    return await this.userRepository.save(user);
  }

  async findOneWithProfile(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findOneWithPosts(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.categories'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findAllWithRelations(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['profile', 'posts'],
    });
  }
}
```

### Post Service with Many-to-Many
```typescript
// src/post/post.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';
import { Category } from '../category/category.entity';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const { categoryIds, ...postData } = createPostDto;
    
    const post = this.postRepository.create(postData);
    
    // Handle categories (many-to-many)
    if (categoryIds && categoryIds.length > 0) {
      const categories = await this.categoryRepository.find({
        where: { id: In(categoryIds) },
      });
      post.categories = categories;
    }
    
    return await this.postRepository.save(post);
  }

  async addCategoryToPost(postId: string, categoryId: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['categories'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }
    
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    
    // Check if category already exists
    if (!post.categories.find(c => c.id === categoryId)) {
      post.categories.push(category);
      await this.postRepository.save(post);
    }
    
    return post;
  }

  async findPostsByCategory(categoryId: string): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.categories', 'postCategories')
      .getMany();
  }
}
```

## Using Relations in Controllers

```typescript
// src/user/user.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id/with-profile')
  async findOneWithProfile(@Param('id') id: string): Promise<User> {
    return this.userService.findOneWithProfile(id);
  }

  @Get(':id/with-posts')
  async findOneWithPosts(@Param('id') id: string): Promise<User> {
    return this.userService.findOneWithPosts(id);
  }
}
```

## Running the Application

### 1. Start PostgreSQL
```bash
# Using Docker
docker run --name postgres-nest \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=nestjs_relations \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 2. Run Migrations
```bash
npm run build
typeorm migration:run
```

### 3. Start NestJS Application
```bash
npm run start:dev
```

## Summary of Commands

```bash
# Initialize project
nest new nestjs-typeorm-relations

# Install dependencies
npm install @nestjs/typeorm typeorm pg @nestjs/config
npm install -D @types/node

# Generate modules
nest generate module user
nest generate service user
nest generate controller user

# Repeat for other entities...

# Generate migration
typeorm migration:generate -n CreateRelationsTables

# Run migration
typeorm migration:run

# Start application
npm run start:dev
```

This example demonstrates all three relationship types in NestJS with TypeORM:
1. **One-to-One**: User ↔ Profile
2. **One-to-Many**: User ↔ Post
3. **Many-to-Many**: Post ↔ Category

Each relationship includes proper migration setup, entity definitions, and service implementations with relation handling.