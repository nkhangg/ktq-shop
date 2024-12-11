import { TypeOrmModule } from '@nestjs/typeorm';
import KtqSession from '@/entities/ktq-sessions.entity';
import { Module } from '@nestjs/common';
import { KtqSessionsService } from './ktq-sessions.service';
import { KtqSessionsController } from './ktq-sessions.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqSession]), KtqCachesModule],
    providers: [KtqSessionsService],
    exports: [KtqSessionsService],
    controllers: [KtqSessionsController],
})
export class KtqSessionsModule {}
