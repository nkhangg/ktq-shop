import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { KtqQueuesService } from './ktq-queues.service';
import { KtqQueueProcessor } from './ktq-queue.processor';
import { KtqConfigEmailsModule } from '../ktq-config-emails/ktq-config-emails.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import KtqQueueConstant from '@/constants/ktq-queue.constant';
@Module({
    imports: [
        BullModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                redis: {
                    host: configService.get<string>('REDIS_HOST'),
                    port: configService.get<number>('REDIS_PORT'),
                },
            }),
            inject: [ConfigService],
        }),
        BullModule.registerQueue({
            name: KtqQueueConstant.QUEUE_NAME,
        }),
        KtqConfigEmailsModule,
    ],
    providers: [KtqQueuesService, KtqQueueProcessor],
    exports: [KtqQueuesService],
})
export class KtqQueuesModule {}
