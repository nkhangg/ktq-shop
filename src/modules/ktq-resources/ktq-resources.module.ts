import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResource from '@/entities/ktq-resources.entity';
import { Module } from '@nestjs/common';
import { KtqResourcesService } from './ktq-resources.service';
import { KtqAppConfigsModule } from '../ktq-app-configs/ktq-app-configs.module';
import { KtqResourcesController } from './ktq-resources.controller';
import { KtqRolesModule } from '../ktq-roles/ktq-roles.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';

@Module({
    imports: [TypeOrmModule.forFeature([KtqResource, KtqResourcePermission]), KtqAppConfigsModule, KtqRolesModule, KtqCachesModule],
    providers: [KtqResourcesService],
    controllers: [KtqResourcesController],
    exports: [KtqResourcesService],
})
export class KtqResourcesModule {}
