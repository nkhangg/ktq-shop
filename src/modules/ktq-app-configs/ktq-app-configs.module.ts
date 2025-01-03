import { KtqDatabasesModule } from '@/modules/ktq-databases/ktq-databases.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqAppConfigsController } from './ktq-app-configs.controller';
import { KtqAppConfigsService } from './ktq-app-configs.service';
import { KtqConfigEmailsModule } from '../ktq-config-emails/ktq-config-emails.module';
import { KtqQueuesModule } from '../ktq-queues/ktq-queues.module';
import { MulterModule } from '@nestjs/platform-express';
import KtqAppConstant from '@/constants/ktq-app.constant';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MulterModule.register({
            dest: KtqAppConstant.MEDIA_PATH,
        }),
        KtqCachesModule,
        KtqConfigEmailsModule,
        KtqDatabasesModule,
        KtqQueuesModule,
        KtqConfigsModule,
    ],
    providers: [KtqAppConfigsService],
    exports: [KtqAppConfigsService],
    controllers: [KtqAppConfigsController],
})
export class KtqAppConfigsModule {}
