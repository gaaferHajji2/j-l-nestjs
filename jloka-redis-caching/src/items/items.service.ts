import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as cacheManager_1 from 'cache-manager';

@Injectable()
export class ItemsService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager_1.Cache) {}

  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  findAll() {
    throw new Error('Method not implemented.');
  }
}
