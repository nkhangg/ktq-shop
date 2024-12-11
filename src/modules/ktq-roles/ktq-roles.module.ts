import { TypeOrmModule } from '@nestjs/typeorm';
import KtqRole from '@/entities/ktq-roles.entity';
import { Module } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';
import { KtqRolesController } from './ktq-roles.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqRole]), KtqCachesModule],
    providers: [KtqRolesService],
    controllers: [KtqRolesController],
    exports: [KtqRolesService],
})
export class KtqRolesModule {}
