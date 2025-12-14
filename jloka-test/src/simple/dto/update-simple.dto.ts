import { PartialType } from '@nestjs/mapped-types';
import { CreateSimpleDto } from './create-simple.dto';

export class UpdateSimpleDto extends PartialType(CreateSimpleDto) {}
