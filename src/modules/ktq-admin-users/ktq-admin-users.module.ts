import { TypeOrmModule } from '@nestjs/typeorm';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { Module } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { KtqAdminUsersController } from './ktq-admin-users.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import KtqRole from '@/entities/ktq-roles.entity';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAdminUser, KtqRole]), KtqCachesModule, KtqSessionsModule],
    providers: [KtqAdminUsersService],
    controllers: [KtqAdminUsersController],
    exports: [KtqAdminUsersService],
})
export class KtqAdminUsersModule {}
