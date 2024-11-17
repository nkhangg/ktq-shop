import { TypeOrmModule } from '@nestjs/typeorm';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { Module } from '@nestjs/common';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqUserBlackList])],
    providers: [KtqUserBlackListsService],
    exports: [KtqUserBlackListsService],
})
export class KtqUserBlackListsModule {}
