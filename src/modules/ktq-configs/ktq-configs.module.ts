import { TypeOrmModule } from '@nestjs/typeorm';
import KtqConfig from '@/entities/ktq-configs.entity';
import { Module } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqConfigsRoutes } from './ktq-configs.route';
import { KtqConfigsController } from './controllers/ktq-configs.controller';
import { KtqConfigsPublicController } from './controllers/ktq-config-public.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqConfig]), KtqCachesModule],
    controllers: [KtqConfigsController, KtqConfigsPublicController],
    providers: [KtqConfigsService, KtqConfigsRoutes],
    exports: [KtqConfigsService],
})
export class KtqConfigsModule {}
