import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Author } from '../../author/schemas/author.schema';
import { Category } from '../../category/schemas/category.schema';

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