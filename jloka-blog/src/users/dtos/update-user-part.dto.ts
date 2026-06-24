/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// Make all properties of CreateUserDto are optional
export class UpdateUserPartDTO extends PartialType(CreateUserDto) {}
