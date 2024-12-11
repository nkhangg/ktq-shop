import { TypeOrmModule } from '@nestjs/typeorm';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { Module } from '@nestjs/common';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';
import { KtqUserBlackListsController } from './ktq-user-black-lists.controller';
import { KtqUserBlackListLogsModule } from '../ktq-user-black-list-logs/ktq-user-black-list-logs.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqUserBlackList]), KtqUserBlackListLogsModule, KtqCachesModule],
    providers: [KtqUserBlackListsService],
    exports: [KtqUserBlackListsService],
    controllers: [KtqUserBlackListsController],
})
export class KtqUserBlackListsModule {}
