import { TypeOrmModule } from '@nestjs/typeorm';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { Module } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { KtqAdminUsersController } from './ktq-admin-users.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAdminUser])],
    providers: [KtqAdminUsersService],
    controllers: [KtqAdminUsersController],
    exports: [KtqAdminUsersService],
})
export class KtqAdminUsersModule {}
