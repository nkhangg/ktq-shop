import KtqAppConstant from '@/constants/ktq-app.constant';
import { CacheInterceptor } from '@/interceptors/cache-interceptor';
import { RedisModule } from '@nestjs-modules/ioredis';
import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { redisStore } from 'cache-manager-redis-yet';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqEventsModule } from '../ktq-events-sse/ktq-events-sse.module';
import { KtqCachesController } from './ktq-caches.controller';
import { KtqCachesService } from './services/ktq-caches.service';
import { RedisKeyExpirationListenerService } from './services/redis-key-expiration-listener.service';
@Module({
    imports: [
        ConfigModule,
        KtqEventsModule,
        forwardRef(() => KtqAdminUsersModule),
        CacheModule.registerAsync({
            isGlobal: true,
            useFactory: async (configService: ConfigService) => {
                const store = await redisStore({
                    ttl: Number(configService.get(KtqAppConstant.CONFIG_REDIS_TTL)) * 1000,
                    socket: {
                        host: configService.get(KtqAppConstant.CONFIG_REDIS_HOST),
                        port: configService.get(KtqAppConstant.CONFIG_REDIS_PORT),
                    },
                });

                return {
                    store: store as unknown as CacheStore,
                    ttl: Number(configService.get(KtqAppConstant.CONFIG_REDIS_TTL)) * 1000,
                };
            },
            inject: [ConfigService],
        }),
        RedisModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'single',
                options: {
                    socketTimeout: 20000,
                },
                url: `redis://${configService.get(KtqAppConstant.CONFIG_REDIS_HOST)}:${configService.get(KtqAppConstant.CONFIG_REDIS_PORT)}`,
            }),
        }),
    ],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: CacheInterceptor,
        },
        KtqCachesService,
        RedisKeyExpirationListenerService,
    ],
    exports: [KtqCachesService],
    controllers: [KtqCachesController],
})
export class KtqCachesModule {}
