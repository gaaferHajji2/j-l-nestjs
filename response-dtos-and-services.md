# Updated Services Using Response DTOs

## 1. User Service with Response DTOs

```typescript
// src/user/user.service.ts
import { 
  Injectable, 
  NotFoundException, 
  ConflictException,
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, DataSource } from 'typeorm';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';
import { Post } from '../post/post.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });
    
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const user = this.userRepository.create(createUserDto);
      
      // Create profile if provided
      if (createUserDto.profile) {
        const profile = this.profileRepository.create(createUserDto.profile);
        user.profile = profile;
      }
      
      const savedUser = await transactionalEntityManager.save(user);
      
      // Load with relations
      const userWithRelations = await transactionalEntityManager.findOne(User, {
        where: { id: savedUser.id },
        relations: ['profile'],
      });
      
      return plainToInstance(UserResponseDto, userWithRelations, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['profile'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findOneWithProfile(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findOneWithPosts(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.categories', 'posts.tags'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async findOneWithAllRelations(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'profile', 
        'posts', 
        'posts.categories', 
        'posts.tags',
        'posts.author',
        'posts.author.profile'
      ],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    // Check email uniqueness if email is being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
    
    // Update user fields
    Object.assign(user, updateUserDto);
    
    // Update profile if provided
    if (updateUserDto.profile && user.profile) {
      Object.assign(user.profile, updateUserDto.profile);
    }
    
    const updatedUser = await this.userRepository.save(user);
    
    // Reload with relations
    const userWithRelations = await this.userRepository.findOne({
      where: { id: updatedUser.id },
      relations: ['profile'],
    });
    
    return plainToInstance(UserResponseDto, userWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    await this.userRepository.remove(user);
  }

  async getUsersWithPosts(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['posts', 'posts.categories'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async searchUsers(searchTerm: string): Promise<UserResponseDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.firstName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.lastName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('profile.bio ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('user.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }
}
```

## 2. Profile Service with Response DTOs

```typescript
// src/profile/profile.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileResponseDto } from './dto/profile-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, createProfileDto: CreateProfileDto): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    
    // Check if profile already exists
    const existingProfile = await this.profileRepository.findOne({
      where: { userId },
    });
    
    if (existingProfile) {
      throw new ConflictException('Profile already exists for this user');
    }
    
    const profile = this.profileRepository.create({
      ...createProfileDto,
      user,
      userId,
    });
    
    const savedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, savedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(ProfileResponseDto, profiles, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    return plainToInstance(ProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  async findByUserId(userId: string): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    return plainToInstance(ProfileResponseDto, profile, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    const updatedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, updatedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async updateByUserId(userId: string, updateProfileDto: UpdateProfileDto): Promise<ProfileResponseDto> {
    const profile = await this.profileRepository.findOne({
      where: { userId },
      relations: ['user'],
    });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    Object.assign(profile, updateProfileDto);
    
    const updatedProfile = await this.profileRepository.save(profile);
    
    return plainToInstance(ProfileResponseDto, updatedProfile, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { id } });
    
    if (!profile) {
      throw new NotFoundException(`Profile with ID ${id} not found`);
    }
    
    await this.profileRepository.remove(profile);
  }

  async removeByUserId(userId: string): Promise<void> {
    const profile = await this.profileRepository.findOne({ where: { userId } });
    
    if (!profile) {
      throw new NotFoundException(`Profile for user with ID ${userId} not found`);
    }
    
    await this.profileRepository.remove(profile);
  }

  async searchProfiles(searchTerm: string): Promise<ProfileResponseDto[]> {
    const profiles = await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('profile.bio ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('profile.location ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('profile.website ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.email ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.firstName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('user.lastName ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('profile.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(ProfileResponseDto, profiles, {
      excludeExtraneousValues: true,
    });
  }
}
```

## 3. Post Service with Response DTOs

```typescript
// src/post/post.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { AssignTagsToPostDto } from './dto/post-tag.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    const author = await this.userRepository.findOne({
      where: { id: createPostDto.authorId },
    });
    
    if (!author) {
      throw new NotFoundException(`Author with ID ${createPostDto.authorId} not found`);
    }

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      const post = this.postRepository.create({
        ...createPostDto,
        author,
      });

      // Handle categories
      if (createPostDto.categoryIds && createPostDto.categoryIds.length > 0) {
        const categories = await transactionalEntityManager.find(Category, {
          where: { id: In(createPostDto.categoryIds) },
        });
        
        if (categories.length !== createPostDto.categoryIds.length) {
          throw new BadRequestException('Some categories were not found');
        }
        
        post.categories = categories;
      }

      // Handle tags
      if (createPostDto.tagIds && createPostDto.tagIds.length > 0) {
        const tags = await transactionalEntityManager.find(Tag, {
          where: { id: In(createPostDto.tagIds) },
        });
        
        if (tags.length !== createPostDto.tagIds.length) {
          throw new BadRequestException('Some tags were not found');
        }
        
        post.tags = tags;
      }

      const savedPost = await transactionalEntityManager.save(post);
      
      // Load with all relations
      const postWithRelations = await transactionalEntityManager.findOne(Post, {
        where: { id: savedPost.id },
        relations: ['author', 'author.profile', 'categories', 'tags'],
      });
      
      return plainToInstance(PostResponseDto, postWithRelations, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['author', 'author.profile', 'categories', 'tags'],
      where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findAllIncludeUnpublished(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['author', 'author.profile', 'categories', 'tags'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    // Check if post is published
    if (!post.isPublished) {
      throw new NotFoundException(`Post with ID ${id} is not published`);
    }
    
    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findOneIncludeUnpublished(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async findByAuthor(authorId: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      where: { authorId, isPublished: true },
      relations: ['author', 'author.profile', 'categories', 'tags'],
      order: { createdAt: 'DESC' },
    });
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findByCategory(categoryId: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.categories', 'category')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('post.isPublished = :isPublished', { isPublished: true })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findByTag(tagId: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .innerJoin('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('tag.id = :tagId', { tagId })
      .andWhere('post.isPublished = :isPublished', { isPublished: true })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['categories', 'tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return await this.dataSource.transaction(async (transactionalEntityManager) => {
      // Update basic fields
      Object.assign(post, updatePostDto);

      // Handle categories if provided
      if (updatePostDto.categoryIds !== undefined) {
        if (updatePostDto.categoryIds.length > 0) {
          const categories = await transactionalEntityManager.find(Category, {
            where: { id: In(updatePostDto.categoryIds) },
          });
          
          if (categories.length !== updatePostDto.categoryIds.length) {
            throw new BadRequestException('Some categories were not found');
          }
          
          post.categories = categories;
        } else {
          post.categories = [];
        }
      }

      // Handle tags if provided
      if (updatePostDto.tagIds !== undefined) {
        if (updatePostDto.tagIds.length > 0) {
          const tags = await transactionalEntityManager.find(Tag, {
            where: { id: In(updatePostDto.tagIds) },
          });
          
          if (tags.length !== updatePostDto.tagIds.length) {
            throw new BadRequestException('Some tags were not found');
          }
          
          post.tags = tags;
        } else {
          post.tags = [];
        }
      }

      const updatedPost = await transactionalEntityManager.save(post);
      
      // Load with all relations
      const postWithRelations = await transactionalEntityManager.findOne(Post, {
        where: { id: updatedPost.id },
        relations: ['author', 'author.profile', 'categories', 'tags'],
      });
      
      return plainToInstance(PostResponseDto, postWithRelations, {
        excludeExtraneousValues: true,
      });
    });
  }

  async remove(id: string): Promise<void> {
    const post = await this.postRepository.findOne({ where: { id } });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    await this.postRepository.remove(post);
  }

  async assignTags(postId: string, assignTagsDto: AssignTagsToPostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const tags = await this.tagRepository.find({
      where: { id: In(assignTagsDto.tagIds) },
    });
    
    if (tags.length !== assignTagsDto.tagIds.length) {
      throw new BadRequestException('Some tags were not found');
    }

    // Add only new tags
    const existingTagIds = post.tags.map(tag => tag.id);
    const newTags = tags.filter(tag => !existingTagIds.includes(tag.id));
    
    post.tags = [...post.tags, ...newTags];
    
    const updatedPost = await this.postRepository.save(post);
    
    // Load with relations
    const postWithRelations = await this.postRepository.findOne({
      where: { id: updatedPost.id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    return plainToInstance(PostResponseDto, postWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async removeTags(postId: string, removeTagsDto: AssignTagsToPostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    // Filter out tags to remove
    post.tags = post.tags.filter(tag => !removeTagsDto.tagIds.includes(tag.id));
    
    const updatedPost = await this.postRepository.save(post);
    
    // Load with relations
    const postWithRelations = await this.postRepository.findOne({
      where: { id: updatedPost.id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    return plainToInstance(PostResponseDto, postWithRelations, {
      excludeExtraneousValues: true,
    });
  }

  async publishPost(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    post.isPublished = true;
    const updatedPost = await this.postRepository.save(post);
    
    return plainToInstance(PostResponseDto, updatedPost, {
      excludeExtraneousValues: true,
    });
  }

  async unpublishPost(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories', 'tags'],
    });
    
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    
    post.isPublished = false;
    const updatedPost = await this.postRepository.save(post);
    
    return plainToInstance(PostResponseDto, updatedPost, {
      excludeExtraneousValues: true,
    });
  }

  async searchPosts(searchTerm: string): Promise<PostResponseDto[]> {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('author.profile', 'profile')
      .leftJoinAndSelect('post.categories', 'categories')
      .leftJoinAndSelect('post.tags', 'tags')
      .where('post.title ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('post.content ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('post.isPublished = :isPublished', { isPublished: true })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }
}
```

## 4. Category Service with Response DTOs

```typescript
// src/category/category.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Post } from '../post/post.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryResponseDto> {
    // Check if category with same name exists
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });
    
    if (existingCategory) {
      throw new ConflictException('Category with this name already exists');
    }
    
    const category = this.categoryRepository.create(createCategoryDto);
    const savedCategory = await this.categoryRepository.save(category);
    
    return plainToInstance(CategoryResponseDto, savedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
    
    return plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  async findAllIncludeInactive(): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository.find({
      order: { name: 'ASC' },
    });
    
    return plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async findOneWithPosts(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.author', 'posts.tags'],
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async findByName(name: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { name },
    });
    
    if (!category) {
      throw new NotFoundException(`Category with name "${name}" not found`);
    }
    
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    // Check name uniqueness if name is being updated
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });
      
      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }
    }
    
    Object.assign(category, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.save(category);
    
    return plainToInstance(CategoryResponseDto, updatedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: string): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    // Check if category has posts
    if (category.posts && category.posts.length > 0) {
      throw new ConflictException('Cannot delete category with associated posts');
    }
    
    await this.categoryRepository.remove(category);
  }

  async deactivate(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    category.isActive = false;
    const updatedCategory = await this.categoryRepository.save(category);
    
    return plainToInstance(CategoryResponseDto, updatedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async activate(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    
    category.isActive = true;
    const updatedCategory = await this.categoryRepository.save(category);
    
    return plainToInstance(CategoryResponseDto, updatedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async getPopularCategories(limit: number = 10): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.posts', 'post')
      .select('category.*')
      .addSelect('COUNT(post.id)', 'postCount')
      .where('category.isActive = :isActive', { isActive: true })
      .groupBy('category.id')
      .orderBy('postCount', 'DESC')
      .addOrderBy('category.name', 'ASC')
      .limit(limit)
      .getRawMany();
    
    // Transform raw result to CategoryResponseDto
    return plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  async searchCategories(searchTerm: string): Promise<CategoryResponseDto[]> {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('category.description ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('category.name', 'ASC')
      .getMany();
    
    return plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }
}
```

## 5. Updated Module Files

### User Module
```typescript
// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { Profile } from '../profile/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
```

### Profile Module
```typescript
// src/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { Profile } from './profile.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, User])],
  controllers: [ProfileController],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
```

### Post Module
```typescript
// src/post/post.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Tag } from '../tag/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, User, Category, Tag])],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService],
})
export class PostModule {}
```

### Category Module
```typescript
// src/category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { Category } from './category.entity';
import { Post } from '../post/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Post])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
```

## 6. Interceptors for Response Transformation

```typescript
// src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly dtoClass: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data instanceof Array) {
          return plainToInstance(this.dtoClass, data, {
            excludeExtraneousValues: true,
          });
        }
        return plainToInstance(this.dtoClass, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
```

## 7. Usage Example in Controller

```typescript
// src/user/user.controller.ts (partial)
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return this.userService.findOne(id);
  }

  @Get()
  @UseInterceptors(new TransformInterceptor(UserResponseDto))
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }
}
```

## Key Improvements:

1. **Response DTO Usage**: All service methods now return Response DTOs instead of raw entities
2. **Class Transformer**: Using `plainToInstance` to transform entities to DTOs with proper serialization
3. **Exclude Extraneous Values**: Removes properties not marked with `@Expose()` in DTOs
4. **Transaction Support**: Using TypeORM transactions for complex operations
5. **Error Handling**: Proper error handling for all scenarios
6. **Query Optimization**: Efficient loading of relations
7. **Search Methods**: Added search functionality for all entities
8. **Business Logic**: Added methods for publishing/unpublishing posts, activating/deactivating categories, etc.
9. **Validation**: Checking for uniqueness constraints and business rules
10. **Pagination Ready**: Methods are structured to easily add pagination later