import { Controller, Get, Post } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';
import { KeyType } from '@/common/enums/key-type.enum';

@Controller('admin/configs')
export class KtqConfigsController {
    constructor(private readonly ktqConfigService: KtqConfigsService) {}

    @Get()
    findAll(): Object {
        return this.ktqConfigService.findAll();
    }

    @Get()
    update(): Object {
        return this.ktqConfigService.update(2, { key_name: 'a', key_type: KeyType.JSON, key_value: '' });
    }

    @Post('init-configs')
    async initConfigs() {
        return await this.ktqConfigService.initConfigs();
    }
}
