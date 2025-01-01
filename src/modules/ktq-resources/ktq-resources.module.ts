import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResource from '@/entities/ktq-resources.entity';
import { forwardRef, Module } from '@nestjs/common';
import { KtqResourcesService } from './ktq-resources.service';
import { KtqAppConfigsModule } from '../ktq-app-configs/ktq-app-configs.module';
import { KtqResourcesController } from './ktq-resources.controller';
import { KtqRolesModule } from '../ktq-roles/ktq-roles.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';
import { KtqResourcesRoutes } from './ktq-resources.route';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqResource, KtqResourcePermission]),
        KtqAppConfigsModule,
        forwardRef(() => KtqRolesModule),
        forwardRef(() => KtqCachesModule),
        KtqConfigsModule,
    ],
    providers: [KtqResourcesService, KtqResourcesRoutes],
    controllers: [KtqResourcesController],
    exports: [KtqResourcesService, KtqResourcesRoutes],
})
export class KtqResourcesModule {}
