import KtqAddress from '@/entities/ktq-addresses.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqAddressesController } from './ktq-addresses.controller';
import { KtqAddressesService } from './ktq-addresses.service';
import KtqCountry from '@/entities/ktq-countries.entity';

@Module({
    imports: [TypeOrmModule.forFeature([KtqAddress, KtqCustomer, KtqCountry]), KtqCachesModule],
    providers: [KtqAddressesService],
    exports: [KtqAddressesService],
    controllers: [KtqAddressesController],
})
export class KtqAddressesModule {}
