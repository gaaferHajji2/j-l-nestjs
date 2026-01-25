import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ItemService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async findOne(id: string) {
    const cachedItem = await this.cacheManager.get(id); // Use the get method

    if (cachedItem) {
      return cachedItem;
    }

    const item = await this.fetchItemFromDatabase(id); // Replace with your database logic

    // Set item in cache, with an optional specific TTL (e.g., 60 seconds)
    await this.cacheManager.set(id, item, 60000);

    return item;
  }
}
