import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqRole from '@/entities/ktq-roles.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqPermissionsController } from './ktq-permissions.controller';
import { KtqPermissionsService } from './ktq-permissions.service';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';
import { KtqPermissionsRoutes } from './ktq-permissions.route';

@Module({
    imports: [TypeOrmModule.forFeature([KtqPermission, KtqRolePermission, KtqRole]), KtqCachesModule, KtqConfigsModule],
    providers: [KtqPermissionsService, KtqPermissionsRoutes],
    controllers: [KtqPermissionsController],
    exports: [KtqPermissionsService],
})
export class KtqPermissionsModule {}
