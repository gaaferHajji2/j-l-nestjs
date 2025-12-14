import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SimpleService } from './simple.service';
import { CreateSimpleDto } from './dto/create-simple.dto';
import { UpdateSimpleDto } from './dto/update-simple.dto';

@Controller('simple')
export class SimpleController {
  constructor(private readonly simpleService: SimpleService) {}

  @Post()
  create(@Body() createSimpleDto: CreateSimpleDto) {
    return this.simpleService.create(createSimpleDto);
  }

  @Get()
  findAll() {
    return this.simpleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.simpleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSimpleDto: UpdateSimpleDto) {
    return this.simpleService.update(+id, updateSimpleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.simpleService.remove(+id);
  }
}
