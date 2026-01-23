import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { DataSource, In, Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Category } from 'src/category/category.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { PostResponseDto } from './dto/post-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) { }

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

      const savedPost = await transactionalEntityManager.save(post);

      // Load with all relations
      const postWithRelations = await transactionalEntityManager.findOne(Post, {
        where: { id: savedPost.id },
        relations: ['author', 'author.profile', 'categories'],
      });

      return plainToInstance(PostResponseDto, postWithRelations, {
        excludeExtraneousValues: true,
      });
    });
  }

  async findAll(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({
      relations: ['author', 'author.profile', 'categories'],
      //   where: { isPublished: true },
      order: { createdAt: 'DESC' },
    });

    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'author.profile', 'categories'],
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    // // Check if post is published
    // if (!post.isPublished) {
    //   throw new NotFoundException(`Post with ID ${id} is not published`);
    // }

    return plainToInstance(PostResponseDto, post, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['categories'],
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
      const updatedPost = await transactionalEntityManager.save(post);

      // Load with all relations
      const postWithRelations = await transactionalEntityManager.findOne(Post, {
        where: { id: updatedPost.id },
        relations: ['author', 'author.profile', 'categories'],
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
      .where('post.title LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('post.content LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .andWhere('post.isPublished = :isPublished', { isPublished: true })
      .orderBy('post.createdAt', 'DESC')
      .getMany();
    
    return plainToInstance(PostResponseDto, posts, {
      excludeExtraneousValues: true,
    });
  }

}