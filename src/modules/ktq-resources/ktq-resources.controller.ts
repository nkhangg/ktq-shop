import { Controller, Post, Req } from '@nestjs/common';
import { KtqResourcesService } from './ktq-resources.service';
import { Request } from 'express';

@Controller('admin/resources')
export class KtqResourcesController {
    constructor(private readonly ktqResourceService: KtqResourcesService) {}

    @Post('import-resource')
    async importResources(@Req() request: Request) {
        return this.ktqResourceService.importResources(request);
    }
}
