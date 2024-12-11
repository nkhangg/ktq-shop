import KtqCustomer from '@/entities/ktq-customers.entity';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import { KtqCustomersController } from './ktq-customers.controller';
import { KtqCustomersService } from './ktq-customers.service';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqUserBlackListsModule } from '../ktq-user-black-lists/ktq-user-black-lists.module';
import { KtqAddressesModule } from '../ktq-addresses/ktq-addresses.module';
import { KtqCustomerGroupsModule } from '../ktq-customer-groups/ktq-customer-groups.module';
import { KtqAuthenticationsModule } from '../ktq-authentications/ktq-authentications.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqCustomer]),
        KtqSessionsModule,
        KtqCachesModule,
        KtqUserBlackListsModule,
        KtqAddressesModule,
        KtqCustomerGroupsModule,
        forwardRef(() => KtqAuthenticationsModule),
    ],
    providers: [KtqCustomersService],
    exports: [KtqCustomersService],
    controllers: [KtqCustomersController],
})
export class KtqCustomersModule {}
