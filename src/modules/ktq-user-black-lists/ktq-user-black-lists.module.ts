import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqUserBlackListLogsModule } from '../ktq-user-black-list-logs/ktq-user-black-list-logs.module';
import { KtqUserBlackListsController } from './ktq-user-black-lists.controller';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';
import { KtqCustomersModule } from '../ktq-customers/ktq-customers.module';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';
import { KtqUserBlackListsRoutes } from './ktq-user-black-lists.route';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqUserBlackList]),
        KtqUserBlackListLogsModule,
        KtqCachesModule,
        KtqAdminUsersModule,
        forwardRef(() => KtqCustomersModule),
        forwardRef(() => KtqConfigsModule),
    ],
    providers: [KtqUserBlackListsService, KtqUserBlackListsRoutes],
    exports: [KtqUserBlackListsService, KtqUserBlackListsRoutes],
    controllers: [KtqUserBlackListsController],
})
export class KtqUserBlackListsModule {}
