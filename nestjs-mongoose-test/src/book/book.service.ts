import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { Model, Types } from 'mongoose';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

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

    if(!Types.ObjectId.isValid(authorId)) {
        throw new BadRequestException("AuthorId not valid")
    }

    let query = this.bookModel.find({ author: authorId })

    if (populateConfig.categories) {
      query = query.populate('categories')
    }

    return query.exec()
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
