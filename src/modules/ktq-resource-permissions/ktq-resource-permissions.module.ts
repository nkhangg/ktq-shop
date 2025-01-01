import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import { Module } from '@nestjs/common';
import { KtqResourcePermissionsService } from './ktq-resource-permissions.service';
import { KtqResourcePermissionsController } from './ktq-resource-permissions.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqResourcePermissionsRoutes } from './ktq-resource-permissions.route';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqResourcePermission]), KtqCachesModule, KtqConfigsModule],
    providers: [KtqResourcePermissionsService, KtqResourcePermissionsRoutes],
    exports: [KtqResourcePermissionsService],
    controllers: [KtqResourcePermissionsController],
})
export class KtqResourcePermissionsModule {}
