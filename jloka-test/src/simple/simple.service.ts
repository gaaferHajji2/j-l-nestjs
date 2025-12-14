import { Injectable } from '@nestjs/common';
import { CreateSimpleDto } from './dto/create-simple.dto';
import { UpdateSimpleDto } from './dto/update-simple.dto';

@Injectable()
export class SimpleService {
  create(createSimpleDto: CreateSimpleDto) {
    return 'This action adds a new simple';
  }

  findAll() {
    return `This action returns all simple`;
  }

  findOne(id: number) {
    return `This action returns a #${id} simple`;
  }

  update(id: number, updateSimpleDto: UpdateSimpleDto) {
    return `This action updates a #${id} simple`;
  }

  remove(id: number) {
    return `This action removes a #${id} simple`;
  }
}
