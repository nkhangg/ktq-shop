import Redis from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { InjectRedis } from '@nestjs-modules/ioredis';
import KtqResponse from '@/common/systems/response/ktq-response';
import { camelToSnakeCase } from '@/utils/app';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import { ClearCacheByKeys } from '@/common/dtos/ktq-caches.dto';
import KtqAppConstant from '@/constants/ktq-app.constant';
import { HttpStatusCode } from 'axios';
@Injectable()
export class KtqCachesService {
    private API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    private API_VERSION = KtqConfigConstant.getApiVersion().key_value;

    constructor(
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
        @InjectRedis() private readonly redis: Redis,
    ) {}

    async clearKeysByPrefix(prefix: string | ((key: string) => boolean)): Promise<void> {
        const stream = this.redis.scanStream({
            match: typeof prefix === 'string' ? `${prefix}*` : `*`,
        });

        const pipeline = this.redis.pipeline();
        for await (const keys of stream) {
            if (keys.length > 0) {
                keys.forEach((key: string) => {
                    if (typeof prefix === 'string') {
                        if (key.includes(prefix)) {
                            pipeline.del(key);
                        }
                    } else {
                        if (prefix(key)) {
                            pipeline.del(key);
                        }
                    }
                });
            }
        }

        await pipeline.exec();
    }

    async clearKeysByPrefixes(prefixes: string[] | ((key: string) => boolean)[]): Promise<void> {
        for (const prefix of prefixes) {
            await this.clearKeysByPrefix(prefix);
        }
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

    async getCacheStatus(): Promise<{ totalKeys: number; usedMemory: string }> {
        const totalKeys = await this.redis.dbsize();
        const memoryInfo = await this.redis.info('memory');
        const usedMemoryMatch = memoryInfo.match(/used_memory_human:(\S+)/);
        const usedMemory = usedMemoryMatch ? usedMemoryMatch[1] : '0B';

        return {
            totalKeys,
            usedMemory,
        };
    }

    async countKeysByPrefix(prefixOrRegex: string | RegExp | ((key: string) => boolean)): Promise<number> {
        let cursor = '0';
        let totalKeys = 0;

        do {
            const [nextCursor, keys] =
                typeof prefixOrRegex === 'string' ? await this.redis.scan(cursor, 'MATCH', `${prefixOrRegex}*`, 'COUNT', 100) : await this.redis.scan(cursor, 'COUNT', 100);

            cursor = nextCursor;

            let filteredKeys: string[];

            if (typeof prefixOrRegex === 'string') {
                filteredKeys = keys;
            } else if (prefixOrRegex instanceof RegExp) {
                filteredKeys = keys.filter((key) => prefixOrRegex.test(key));
            } else if (typeof prefixOrRegex === 'function') {
                filteredKeys = keys.filter((key) => prefixOrRegex(key));
            } else {
                filteredKeys = [];
            }

            totalKeys += filteredKeys.length;
        } while (cursor !== '0');

        return totalKeys;
    }

    async countKeysExcluding(exclusions: (string | RegExp)[]): Promise<number> {
        let cursor = '0';
        let totalKeys = 0;

        do {
            const [nextCursor, keys] = await this.redis.scan(cursor, 'COUNT', 100);
            cursor = nextCursor;

            const validKeys = keys.filter((key) => {
                return !exclusions.some((exclusion) => {
                    return typeof exclusion === 'string' ? key.startsWith(exclusion) : exclusion.test(key);
                });
            });

            totalKeys += validKeys.length;
        } while (cursor !== '0');

        return totalKeys;
    }

    async getReportInformation(less?: boolean) {
        const status = await this.getCacheStatus();

        if (less) {
            return KtqResponse.toResponse({ ...camelToSnakeCase(status) });
        }

        const private_keys = await this.countKeysByPrefix(`/${this.API_PREFIX}/${this.API_VERSION}/admin`);
        const public_keys = await this.countKeysByPrefix((key) => {
            return key.includes(`/${this.API_PREFIX}/${this.API_VERSION}`) && !key.includes('admin');
        });

        return KtqResponse.toResponse({ ...camelToSnakeCase(status), private_keys, public_keys, system_keys: status.totalKeys - (private_keys + public_keys) });
    }

    async clearCacheByKeys({ cache_keys }: ClearCacheByKeys) {
        const prefixes = [];

        if (cache_keys.length === KtqAppConstant.CACHE_KEYS.length) {
            this.clearKeysByPrefix('');
            return KtqResponse.toResponse(true);
        }

        if (cache_keys.includes('private_keys')) {
            prefixes.push(`/${this.API_PREFIX}/${this.API_VERSION}/admin`);
        }

        if (cache_keys.includes('public_keys')) {
            prefixes.push((key: string) => {
                return key.includes(`/${this.API_PREFIX}/${this.API_VERSION}`) && !key.includes('admin');
            });
        }

        if (cache_keys.includes('system_keys')) {
            prefixes.push((key: string) => {
                return !key.includes(`/${this.API_PREFIX}/${this.API_VERSION}`);
            });
        }

        if (prefixes.length) {
            this.clearKeysByPrefixes(prefixes);
            return KtqResponse.toResponse(true);
        }

        throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Keys is empty', status_code: HttpStatusCode.BadRequest }));
    }
}
