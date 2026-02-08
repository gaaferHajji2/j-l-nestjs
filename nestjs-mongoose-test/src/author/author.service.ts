import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Author, AuthorDocument } from './schemas/author.schema';
import { Model } from 'mongoose';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

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