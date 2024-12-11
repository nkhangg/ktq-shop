import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class KtqCachesService {
    constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

    async clearKeysByPrefix(prefix: string): Promise<void> {
        const keys = await this.cacheManager.store.keys(`${prefix}*`);
        if (keys.length > 0) {
            keys.forEach(async (item) => {
                await this.cacheManager.del(item);
            });
        }
    }

    async remember<M>(cache_key: string, ttl: number, callback: () => Promise<M>) {
        let cache_data: M | undefined = await this.cacheManager.get(cache_key);

        if (cache_data) return cache_data;

        cache_data = await callback();

        await this.cacheManager.set(cache_key, cache_data, ttl);

        return cache_data;
    }
}
