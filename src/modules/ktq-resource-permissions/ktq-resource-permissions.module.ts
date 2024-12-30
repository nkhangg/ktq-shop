import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import { Module } from '@nestjs/common';
import { KtqResourcePermissionsService } from './ktq-resource-permissions.service';
import { KtqResourcePermissionsController } from './ktq-resource-permissions.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqResourcePermission]), KtqCachesModule],
    providers: [KtqResourcePermissionsService],
    exports: [KtqResourcePermissionsService],
    controllers: [KtqResourcePermissionsController],
})
export class KtqResourcePermissionsModule {}
