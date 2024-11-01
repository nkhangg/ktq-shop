import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { KtqAdminUsersModule } from '../ktq-admin-users/ktq-admin-users.module';
import { KtqRolesModule } from '../ktq-roles/ktq-roles.module';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import { KtqAdminAuthenticationsController } from './controllers/ktq-admin-authentications.controller';
import { KtqAuthenticationsService } from './ktq-authentications.service';
import { KtqCustomersModule } from '../ktq-customers/ktq-customers.module';
import { KtqCustomerAuthenticationsController } from './controllers/ktq-customer-authentications.controller';

@Module({
    imports: [
        KtqAdminUsersModule,
        KtqCustomersModule,
        KtqSessionsModule,
        KtqRolesModule,
        PassportModule,
        JwtModule.register({
            global: true,
            secret: process.env.SECRET_KEY,
            signOptions: { expiresIn: '15m' },
        }),
    ],
    controllers: [KtqAdminAuthenticationsController, KtqCustomerAuthenticationsController],
    providers: [KtqAuthenticationsService],
    exports: [KtqAuthenticationsService],
})
export class KtqAuthenticationsModule {}
