import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { KtqProvincesService } from '../ktq-provinces.service';
import KtqProvince from '@/entities/ktq-provinces.entity';
import KtqDistrict from '@/entities/ktq-districts.entity';
import { AutocompleteKtqAddressDto } from '@/common/dtos/ktq-provinces.dto';
import { CacheTTL } from '@nestjs/cache-manager';

@Controller('locations')
export class KtqLocationController {
    constructor(private ktqProvincesService: KtqProvincesService) {}

    @Get('countries')
    @CacheTTL(300000)
    async countries(@Query('search') search: string) {
        return this.ktqProvincesService.countries(search);
    }

    @Get('provinces')
    @CacheTTL(300000)
    async provinces(@Query('search') search: string) {
        return this.ktqProvincesService.provinces(search);
    }

    @Get('districts')
    @CacheTTL(300000)
    async districts(@Query('province_code') province_code: KtqProvince['code'], @Query('search') search: string, @Query('province_name') province_name: string) {
        return this.ktqProvincesService.district(province_code, province_name, search);
    }

    @Get('wards')
    @CacheTTL(300000)
    async wards(
        @Param('district_code') district_code: KtqDistrict['code'],
        @Query('search') search: string,
        @Query('province_name') province_name: string,
        @Query('district_name') district_name: string,
    ) {
        return this.ktqProvincesService.wards(district_code, province_name, district_name, search);
    }
}
