import { TypeOrmModule } from '@nestjs/typeorm';
import KtqPermission from '@/entities/ktq-permissions.entity';
import { Module } from '@nestjs/common';
import { KtqPermissionsService } from './ktq-permissions.service';
import { KtqPermissionsController } from './ktq-permissions.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqPermission])],
    providers: [KtqPermissionsService],
    controllers: [KtqPermissionsController],
    exports: [KtqPermissionsService],
})
export class KtqPermissionsModule {}
