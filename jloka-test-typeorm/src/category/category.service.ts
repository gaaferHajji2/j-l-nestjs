import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Post } from 'src/post/post.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }
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
      //   where: { isActive: true },
      order: { name: 'ASC' },
    });

    return plainToInstance(CategoryResponseDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<CategoryResponseDto> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts', 'posts.author'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
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