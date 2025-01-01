import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { KtqConfigsRoutes } from '../ktq-configs.route';
import { KtqConfigsService } from '../ktq-configs.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { UpdateKtqConfigDto, UpdatePublicKtqConfigDto } from '@/common/dtos/ktq-configs.dto';

@Controller(KtqConfigsRoutes.PUBLIC)
export class KtqConfigsPublicController {
    constructor(private readonly ktqConfigService: KtqConfigsService) {}

    @Get()
    async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqConfigService.getAllPublicConfigs(query);
    }

    @Get(':key_name')
    async getPublicConfig(@Param('key_name') key_name: string) {
        return await this.ktqConfigService.getPublicConfig(key_name);
    }

    @Put(':key_name')
    async updatePublicConfig(@Param('key_name') key_name: string, @Body() data: UpdatePublicKtqConfigDto) {
        return await this.ktqConfigService.updatePublicConfig(key_name, data);
    }
}
