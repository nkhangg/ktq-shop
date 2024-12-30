import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KtqCachesService } from './services/ktq-caches.service';
import { CacheTTL } from '@nestjs/cache-manager';
import { ClearCacheByKeys } from '@/common/dtos/ktq-caches.dto';

@Controller('admin/cache-services')
export class KtqCachesController {
    constructor(private readonly ktqCacheService: KtqCachesService) {}

    @Get('')
    @CacheTTL(1000)
    async getReportInformation(@Param('less') less: boolean) {
        return await this.ktqCacheService.getReportInformation(less);
    }

    @Post()
    async clearCaches(@Body() data: ClearCacheByKeys) {
        return await this.ktqCacheService.clearCacheByKeys(data);
    }
}
