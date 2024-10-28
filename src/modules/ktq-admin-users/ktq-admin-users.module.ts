import { TypeOrmModule } from '@nestjs/typeorm';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { Module } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { AuthenticationController } from './controllers/authentication.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAdminUser])],
    providers: [KtqAdminUsersService],
    controllers: [AuthenticationController],
    exports: [KtqAdminUsersService],
})
export class KtqAdminUsersModule {}
