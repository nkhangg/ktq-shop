import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqRole from '@/entities/ktq-roles.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqPermissionsController } from './ktq-permissions.controller';
import { KtqPermissionsService } from './ktq-permissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqPermission, KtqRolePermission, KtqRole]), KtqCachesModule],
    providers: [KtqPermissionsService],
    controllers: [KtqPermissionsController],
    exports: [KtqPermissionsService],
})
export class KtqPermissionsModule {}
