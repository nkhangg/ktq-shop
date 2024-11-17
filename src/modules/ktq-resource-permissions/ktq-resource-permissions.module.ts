import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import { Module } from '@nestjs/common';
import { KtqResourcePermissionsService } from './ktq-resource-permissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqResourcePermission])],
    providers: [KtqResourcePermissionsService],
    exports: [KtqResourcePermissionsService],
})
export class KtqResourcePermissionsModule {}
