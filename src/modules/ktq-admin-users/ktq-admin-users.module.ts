import { TypeOrmModule } from '@nestjs/typeorm';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { Module } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { KtqAdminUsersController } from './ktq-admin-users.controller';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAdminUser]), KtqCachesModule, KtqSessionsModule],
    providers: [KtqAdminUsersService],
    controllers: [KtqAdminUsersController],
    exports: [KtqAdminUsersService],
})
export class KtqAdminUsersModule {}
