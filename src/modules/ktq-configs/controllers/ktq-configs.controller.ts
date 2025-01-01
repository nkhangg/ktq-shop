import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
// import { KtqConfigsRoutes } from './ktq-configs.route';
import { CreateKtqConfigDto, DeleteKtqConfigDto, UpdateKtqConfigDto } from '@/common/dtos/ktq-configs.dto';
import KtqConfig from '@/entities/ktq-configs.entity';
import { KtqConfigsService } from '../ktq-configs.service';
import { KtqConfigsRoutes } from '../ktq-configs.route';

@Controller(KtqConfigsRoutes.BASE)
export class KtqConfigsController {
    constructor(private readonly ktqConfigService: KtqConfigsService) {}

    @Get()
    async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqConfigService.getAll(query);
    }

    @Post()
    async createConfig(@Body() data: CreateKtqConfigDto) {
        return await this.ktqConfigService.createConfig(data);
    }

    @Put(':id')
    async updateConfig(@Param('id') id: KtqConfig['id'], @Body() data: UpdateKtqConfigDto) {
        return await this.ktqConfigService.updateConfig(id, data);
    }
    @Delete('')
    async deleteConfigs(@Body() data: DeleteKtqConfigDto) {
        return await this.ktqConfigService.deleteConfigs(data);
    }

    @Post('init-configs')
    async initConfigs() {
        return await this.ktqConfigService.initConfigs();
    }
}
