import { Controller, Get, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { configsRoutes } from './ktq-configs.route';
import { KtqConfigsService } from './ktq-configs.service';

@Controller(configsRoutes.BASE)
export class KtqConfigsController {
    constructor(private readonly ktqConfigService: KtqConfigsService) {}

    @Get()
    async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqConfigService.getAll(query);
    }

    @Post('init-configs')
    async initConfigs() {
        return await this.ktqConfigService.initConfigs();
    }
}
