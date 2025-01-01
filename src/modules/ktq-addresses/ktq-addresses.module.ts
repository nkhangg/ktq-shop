import KtqAddress from '@/entities/ktq-addresses.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqAddressesController } from './ktq-addresses.controller';
import { KtqAddressesService } from './ktq-addresses.service';
import KtqCountry from '@/entities/ktq-countries.entity';
import { KtqAddressRoutes } from './ktq-address.route';
import { KtqConfigsModule } from '../ktq-configs/ktq-configs.module';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAddress, KtqCustomer, KtqCountry]), KtqCachesModule, KtqConfigsModule],
    providers: [KtqAddressesService, KtqAddressRoutes],
    exports: [KtqAddressesService],
    controllers: [KtqAddressesController],
})
export class KtqAddressesModule {}
