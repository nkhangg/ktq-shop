import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';

import { KtqAppConfigsService } from './ktq-app-configs.service';
@Controller('admin/app-configs')
export class KtqAppConfigsController {
    constructor(private readonly ktqAppConfigService: KtqAppConfigsService) {}

    @Post()
    public async upgrade(@Req() req: Request) {
        return await this.ktqAppConfigService.getRoutes(req);
    }
}
