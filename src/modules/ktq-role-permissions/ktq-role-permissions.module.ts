import { TypeOrmModule } from '@nestjs/typeorm';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import { Module } from '@nestjs/common';
import { KtqRolePermissionsService } from './ktq-role-permissions.service';
import { KtqRolePermissionsController } from './ktq-role-permissions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqRolePermission])],
    providers: [KtqRolePermissionsService],
    controllers: [KtqRolePermissionsController],
})
export class KtqRolePermissionsModule {}
