import { TypeOrmModule } from '@nestjs/typeorm';
import KtqSession from '@/entities/ktq-sessions.entity';
import { Module } from '@nestjs/common';
import { KtqSessionsService } from './ktq-sessions.service';
import { KtqSessionsController } from './ktq-sessions.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';
import { KtqSessionsRoutes } from './ktq-sessions.route';

@Module({
    imports: [TypeOrmModule.forFeature([KtqSession]), KtqCachesModule, KtqConfigsModule],
    providers: [KtqSessionsService, KtqSessionsRoutes],
    exports: [KtqSessionsService, KtqSessionsRoutes],
    controllers: [KtqSessionsController],
})
export class KtqSessionsModule {}
