import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCustomerGroupsController } from './ktq-customer-groups.controller';
import { KtqCustomerGroupsService } from './ktq-customer-groups.service';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';
import { KtqCustomerGroupRoutes } from './ktq-customer-groups.route';

@Module({
    imports: [TypeOrmModule.forFeature([KtqCustomerGroup, KtqCustomer]), KtqCachesModule, KtqConfigsModule],
    providers: [KtqCustomerGroupsService, KtqCustomerGroupRoutes],
    controllers: [KtqCustomerGroupsController],
    exports: [KtqCustomerGroupsService, KtqCustomerGroupRoutes],
})
export class KtqCustomerGroupsModule {}
