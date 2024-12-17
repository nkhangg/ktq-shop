import { TypeOrmModule } from '@nestjs/typeorm';
import KtqRole from '@/entities/ktq-roles.entity';
import { forwardRef, Module } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';
import { KtqRolesController } from './ktq-roles.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqResourcesModule } from '../ktq-resources/ktq-resources.module';
import { KtqPermissionsModule } from '../ktq-permissions/ktq-permissions.module';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqRoleResource from '@/entities/ktq-role-resources.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqRole, KtqResource, KtqPermission, KtqRolePermission, KtqRoleResource]),
        forwardRef(() => KtqCachesModule),
        forwardRef(() => KtqAdminUsersModule),
    ],
    providers: [KtqRolesService],
    controllers: [KtqRolesController],
    exports: [KtqRolesService],
})
export class KtqRolesModule {}
