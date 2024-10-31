import { MiddlewareConsumer, Module } from '@nestjs/common';
import excludeRoute from './common/routes/exclude-route';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { KtqAdminUsersModule } from './modules/ktq-admin-users/ktq-admin-users.module';
import { KtqAppConfigsModule } from './modules/ktq-app-configs/ktq-app-configs.module';
import { KtqAppValidatorsModule } from './modules/ktq-app-validators/ktq-app-validators.module';
import { KtqAdminAuthenticationsController } from './modules/ktq-authentications/controllers/ktq-admin-authentications.controller';
import { KtqAuthenticationsModule } from './modules/ktq-authentications/ktq-authentications.module';
import { KtqConfigsModule } from './modules/ktq-configs/ktq-configs.module';
import { KtqRolesModule } from './modules/ktq-roles/ktq-roles.module';
import { KtqSessionsModule } from './modules/ktq-sessions/ktq-sessions.module';
import { KtqWebsitesModule } from './modules/ktq-websites/ktq-websites.module';

@Module({
    imports: [KtqAppConfigsModule, KtqConfigsModule, KtqAppValidatorsModule, KtqAdminUsersModule, KtqAuthenticationsModule, KtqSessionsModule, KtqRolesModule, KtqWebsitesModule],
    controllers: [],
    providers: [],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(...excludeRoute)
            .forRoutes(KtqAdminAuthenticationsController);
    }
}
