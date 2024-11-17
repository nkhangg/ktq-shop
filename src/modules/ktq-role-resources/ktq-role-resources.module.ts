import KtqRoleResource from '@/entities/ktq-role-resources.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqResourcesModule } from '../ktq-resources/ktq-resources.module';
import { KtqRoleResourcesService } from './ktq-role-resources.service';
import { KtqRoleResourcesController } from './ktq-role-resources.controller';
import { KtqResourcePermissionsModule } from '../ktq-resource-permissions/ktq-resource-permissions.module';
import { KtqPermissionsModule } from '../ktq-permissions/ktq-permissions.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqRoleResource]), KtqResourcesModule, KtqResourcePermissionsModule, KtqPermissionsModule],
    providers: [KtqRoleResourcesService],
    controllers: [KtqRoleResourcesController],
})
export class KtqRoleResourcesModule {}
