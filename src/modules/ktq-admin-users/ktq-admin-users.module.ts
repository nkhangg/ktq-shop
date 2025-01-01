import { TypeOrmModule } from '@nestjs/typeorm';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { Module } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { KtqAdminUsersController } from './ktq-admin-users.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import KtqRole from '@/entities/ktq-roles.entity';
import { KtqAdminUserRoutes } from './ktq-admin-users.route';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAdminUser, KtqRole]), KtqCachesModule, KtqSessionsModule, KtqConfigsModule],
    providers: [KtqAdminUsersService, KtqAdminUserRoutes],
    controllers: [KtqAdminUsersController],
    exports: [KtqAdminUsersService, KtqAdminUserRoutes],
})
export class KtqAdminUsersModule {}
