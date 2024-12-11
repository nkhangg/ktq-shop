import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { excludeAuthorization, excludeAuth } from './common/routes/exclude-route';
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
import { KtqCustomersModule } from './modules/ktq-customers/ktq-customers.module';
import { KtqCustomersController } from './modules/ktq-customers/ktq-customers.controller';
import { KtqCustomerAuthenticationsController } from './modules/ktq-authentications/controllers/ktq-customer-authentications.controller';
import { KtqResourcesModule } from './modules/ktq-resources/ktq-resources.module';
import { KtqPermissionsModule } from './modules/ktq-permissions/ktq-permissions.module';
import { AuthorizationMiddleware } from './middlewares/authorization.middleware';
import { KtqRolePermissionsModule } from './modules/ktq-role-permissions/ktq-role-permissions.module';
import { KtqRoleResourcesModule } from './modules/ktq-role-resources/ktq-role-resources.module';
import { KtqResourcePermissionsModule } from './modules/ktq-resource-permissions/ktq-resource-permissions.module';
import { KtqCachesModule } from './modules/ktq-caches/ktq-caches.module';
import { KtqUserBlackListsModule } from './modules/ktq-user-black-lists/ktq-user-black-lists.module';
import { KtqConfigEmailsModule } from './modules/ktq-config-emails/ktq-config-emails.module';
import { KtqUserForgotPasswordsModule } from './modules/ktq-user-forgot-passwords/ktq-user-forgot-passwords.module';
import { KtqQueuesModule } from './modules/ktq-queues/ktq-queues.module';
import { KtqAddressesModule } from './modules/ktq-addresses/ktq-addresses.module';
import { KtqCustomerGroupsModule } from './modules/ktq-customer-groups/ktq-customer-groups.module';
import { KtqUserBlackListLogsModule } from './modules/ktq-user-black-list-logs/ktq-user-black-list-logs.module';
import { KtqAppMediasModule } from './modules/ktq-app-medias/ktq-app-medias.module';
import { KtqProvincesModule } from './modules/ktq-provinces/ktq-provinces.module';

@Module({
    imports: [
        KtqAppConfigsModule,
        KtqAppMediasModule,
        KtqConfigsModule,
        KtqAppValidatorsModule,
        KtqAdminUsersModule,
        KtqAuthenticationsModule,
        KtqSessionsModule,
        KtqRolesModule,
        KtqWebsitesModule,
        KtqCustomersModule,
        KtqResourcesModule,
        KtqPermissionsModule,
        KtqRolePermissionsModule,
        KtqRoleResourcesModule,
        KtqResourcePermissionsModule,
        KtqCachesModule,
        KtqUserBlackListsModule,
        KtqConfigEmailsModule,
        KtqUserForgotPasswordsModule,
        KtqQueuesModule,
        KtqAddressesModule,
        KtqCustomerGroupsModule,
        KtqUserBlackListLogsModule,
        KtqAppMediasModule,
        KtqProvincesModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .exclude(...excludeAuth)
            .forRoutes(KtqAdminAuthenticationsController, KtqCustomerAuthenticationsController, KtqCustomersController);

        consumer
            .apply(AuthorizationMiddleware)
            .exclude(...excludeAuthorization)
            .forRoutes({ path: 'admin/*', method: RequestMethod.ALL });
    }
}
