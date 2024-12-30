import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqUserBlackListLogsModule } from '../ktq-user-black-list-logs/ktq-user-black-list-logs.module';
import { KtqUserBlackListsController } from './ktq-user-black-lists.controller';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqUserBlackList]), KtqUserBlackListLogsModule, KtqCachesModule, KtqAdminUsersModule],
    providers: [KtqUserBlackListsService],
    exports: [KtqUserBlackListsService],
    controllers: [KtqUserBlackListsController],
})
export class KtqUserBlackListsModule {}
