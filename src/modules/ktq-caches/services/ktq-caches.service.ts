import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
@Injectable()
export class KtqCachesService {
    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    async clearKeysByPrefix(prefix: string): Promise<void> {
        // const keys = await this.cacheManager.store.keys(`${prefix}*`);
        // if (keys.length > 0) {
        //     keys.forEach(async (item) => {
        //         await this.cacheManager.del(item);
        //     });
        // }
        const stream = this.redis.scanStream({
            match: `${prefix}*`,
        });

        const pipeline = this.redis.pipeline();
        for await (const keys of stream) {
            keys.forEach((key) => pipeline.del(key));
        }

        await pipeline.exec();
    }

    async remember<M>(cache_key: string, ttl: number, callback: () => Promise<M>) {
        let cache_data: M | undefined = await this.cacheManager.get(cache_key);

        if (cache_data) return cache_data;

        cache_data = await callback();

        await this.cacheManager.set(cache_key, cache_data, ttl);

        return cache_data;
    }

    async setCache<M>(cache_key: string, data: M, ttl?: number) {
        await this.cacheManager.set(cache_key, data, ttl);
    }

    async getCache<M>(cache_key: string) {
        return (await this.cacheManager.get(cache_key)) as M;
    }

    async delCache(cache_key: string) {
        return await this.cacheManager.del(cache_key);
    }
}
