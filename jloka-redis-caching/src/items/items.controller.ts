import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('items')
@UseInterceptors(CacheInterceptor)
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post('/one/:id')
  findOne(@Param('id') id: string, @Body() item: {key: string, value: string}) {
    return this.itemsService.findOne(id, item);
  }
}