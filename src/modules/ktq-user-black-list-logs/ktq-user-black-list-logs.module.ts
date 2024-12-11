import { TypeOrmModule } from '@nestjs/typeorm';
import KtqUserBlackListLog from '@/entities/ktq-user-black-list-logs.entity';
import { Module } from '@nestjs/common';
import { KtqUserBlackListLogsService } from './ktq-user-black-list-logs.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqUserBlackListLog])],
    providers: [KtqUserBlackListLogsService],
    exports: [KtqUserBlackListLogsService],
})
export class KtqUserBlackListLogsModule {}
