import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Category } from '../../category/schemas/category.schema';

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
