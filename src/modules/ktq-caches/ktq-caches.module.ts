import KtqAppConstant from '@/constants/ktq-app.constant';
import { BullModule } from '@nestjs/bull';
import { CacheInterceptor, CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-ioredis';
@Module({
    imports: [
        ConfigModule,
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                return {
                    store: redisStore,
                    host: configService.get(KtqAppConstant.CONFIG_REDIS_HOST),
                    port: configService.get(KtqAppConstant.CONFIG_REDIS_PORT),
                    ttl: configService.get(KtqAppConstant.CONFIG_REDIS_TTL),
                };
            },
            inject: [ConfigService],
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
    ],
})
export class KtqCachesModule {}
