import KtqAddress from '@/entities/ktq-addresses.entity';
import KtqCountry from '@/entities/ktq-countries.entity';
import KtqDistrict from '@/entities/ktq-districts.entity';
import KtqProvince from '@/entities/ktq-provinces.entity';
import KtqWard from '@/entities/ktq-wards.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';
import { KtqLocationController } from './controllers/ktq-location.controller';
import { KtqProvincesController } from './controllers/ktq-provinces.controller';
import { KtqProvincesService } from './ktq-provinces.service';
import { KtqAddressesModule } from '../ktq-addresses/ktq-addresses.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([KtqProvince, KtqDistrict, KtqWard, KtqCountry]),
        // TypeOrmModule.forFeature([KtqAddress]),
        KtqAddressesModule,
        KtqCachesModule,
    ],
    providers: [KtqProvincesService],
    controllers: [KtqProvincesController, KtqLocationController],
    exports: [KtqProvincesService],
})
export class KtqProvincesModule {}
