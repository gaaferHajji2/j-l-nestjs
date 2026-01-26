import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import * as cacheManager_1 from 'cache-manager';

@Injectable()
export class ItemsService {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: cacheManager_1.Cache) {}

  async findOne(id: string, item: { key: string, value: string }) {
    const cachedItem = await this.cacheManager.get(id); // Use the get method

    if (cachedItem) {
      return cachedItem;
    }

    // const item = await this.fetchItemFromDatabase(id); // Replace with your database logic

    // Set item in cache, with an optional specific TTL (e.g., 60 seconds)
    const t1 = await this.cacheManager.set(id, item, 60000);

    return t1;
  }
  async findAll() {
    return this.cacheManager.mget(["*"])
  }
}
