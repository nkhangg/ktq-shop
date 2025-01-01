import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { KtqEventsSseService } from '@/modules/ktq-events-sse/ktq-events-sse.service';
import { extractIds, KtqAdminUserRoutes } from '@/modules/ktq-admin-users/ktq-admin-users.route';

@Injectable()
export class RedisKeyExpirationListenerService implements OnModuleInit {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly eventsService: KtqEventsSseService,
        @Inject(forwardRef(() => KtqAdminUserRoutes)) private readonly ktqAdminUserRoutes: KtqAdminUserRoutes,
    ) {}

    async onModuleInit() {
        const subscriber = this.redis.duplicate();

        await subscriber.config('SET', 'notify-keyspace-events', 'Ex');
        await subscriber.subscribe('__keyevent@0__:expired');

        subscriber.on('message', async (channel, message) => {
            const USE_TIME_PASSWORD = await this.ktqAdminUserRoutes.useTimePassword();
            if (String(message).includes(USE_TIME_PASSWORD)) {
                const { requester_id } = extractIds(message);
                console.log(requester_id);
                this.eventsService.sendToClient('use-time-password-expired', requester_id, { key: message, requester_id });
            }
        });

        console.log('Redis Key Expiration Listener started.');
    }
}
