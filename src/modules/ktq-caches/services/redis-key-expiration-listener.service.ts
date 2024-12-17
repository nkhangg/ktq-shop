import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { KtqEventsSseService } from '@/modules/ktq-events-sse/ktq-events-sse.service';
import { adminUserRoutes, extractIds } from '@/modules/ktq-admin-users/ktq-admin-users.route';

@Injectable()
export class RedisKeyExpirationListenerService implements OnModuleInit {
    constructor(
        @InjectRedis() private readonly redis: Redis,
        private readonly eventsService: KtqEventsSseService,
    ) {}

    async onModuleInit() {
        const subscriber = this.redis.duplicate();

        await subscriber.config('SET', 'notify-keyspace-events', 'Ex');
        await subscriber.subscribe('__keyevent@0__:expired');

        subscriber.on('message', (channel, message) => {
            if (String(message).includes(adminUserRoutes.BASE_USE_TIME_PASSWORD)) {
                const { requester_id } = extractIds(message);
                this.eventsService.sendToClient('use-time-password-expired', requester_id, { key: message, requester_id });
            }
        });

        console.log('Redis Key Expiration Listener started.');
    }
}
