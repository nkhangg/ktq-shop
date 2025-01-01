import { DeleteKtqResourceDto } from '@/common/dtos/ktq-resources.dto';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqRole from '@/entities/ktq-roles.entity';
import { Body, Controller, Delete, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqResourcesService } from './ktq-resources.service';
import { KtqResourcesRoutes } from './ktq-resources.route';

@Controller(KtqResourcesRoutes.BASE)
export class KtqResourcesController {
    constructor(private readonly ktqResourceService: KtqResourcesService) {}

    @Post('import-resource')
    async importResources(@Req() request: Request) {
        return this.ktqResourceService.importResources(request);
    }

    @Post('sync-resources')
    async syncResources(@Req() request: Request) {
        return this.ktqResourceService.importResources(request, true);
    }

    @Get()
    async getAll(@Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getAll(query);
    }

    @Get(':id')
    async getResourceById(@Param('id') id: KtqResource['id']) {
        return this.ktqResourceService.getResourceById(id);
    }

    @Get('roles/:role_id')
    async getResourcesByRole(@Param('role_id') role_id: KtqRole['id'], @Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getResourceByRole(role_id, query);
    }

    @Get('ignore-roles/:role_id')
    async getIgnoreResourcesByRole(@Param('role_id') role_id: KtqRole['id'], @Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getIgnoreResourceByRole(role_id, query);
    }

    @Delete()
    async deleteResource(@Body() data: DeleteKtqResourceDto) {
        return this.ktqResourceService.deleteResource(data);
    }
}
