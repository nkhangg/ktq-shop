import { KtqDatabasesModule } from '@/modules/ktq-databases/ktq-databases.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqAppConfigsController } from './ktq-app-configs.controller';
import { KtqAppConfigsService } from './ktq-app-configs.service';
import { KtqConfigEmailsModule } from '../ktq-config-emails/ktq-config-emails.module';
import { KtqQueuesModule } from '../ktq-queues/ktq-queues.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        KtqCachesModule,
        KtqConfigEmailsModule,
        KtqDatabasesModule,
        KtqQueuesModule,
    ],
    providers: [KtqAppConfigsService],
    exports: [KtqAppConfigsService],
    controllers: [KtqAppConfigsController],
})
export class KtqAppConfigsModule {}
