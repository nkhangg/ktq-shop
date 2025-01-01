import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqRoleResource from '@/entities/ktq-role-resources.entity';
import KtqRole from '@/entities/ktq-roles.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqResourcesModule } from '../ktq-resources/ktq-resources.module';
import { KtqRolesController } from './ktq-roles.controller';
import { KtqRolesService } from './ktq-roles.service';
import { KtqRoleRoutes } from './ktq-role.route';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqRole, KtqResource, KtqPermission, KtqRolePermission, KtqRoleResource, KtqResourcePermission]),
        forwardRef(() => KtqCachesModule),
        forwardRef(() => KtqAdminUsersModule),
        forwardRef(() => KtqResourcesModule),
        forwardRef(() => KtqConfigsModule),
    ],
    providers: [KtqRolesService, KtqRoleRoutes],
    controllers: [KtqRolesController],
    exports: [KtqRolesService, KtqRoleRoutes],
})
export class KtqRolesModule {}
