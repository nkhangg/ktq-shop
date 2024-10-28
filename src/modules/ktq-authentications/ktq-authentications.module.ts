import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqRolesModule } from '../ktq-roles/ktq-roles.module';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import { KtqAdminAuthenticationsController } from './controllers/ktq-admin-authentications.controller';
import { KtqAuthenticationsService } from './ktq-authentications.service';

@Module({
    imports: [
        KtqAdminUsersModule,
        KtqSessionsModule,
        KtqRolesModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [KtqAdminAuthenticationsController],
    providers: [KtqAuthenticationsService],
    exports: [KtqAuthenticationsService],
})
export class KtqAuthenticationsModule {}
