import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { KtqResourcesService } from './ktq-resources.service';
import { Request } from 'express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import KtqRole from '@/entities/ktq-roles.entity';

@Controller('admin/resources')
export class KtqResourcesController {
    constructor(private readonly ktqResourceService: KtqResourcesService) {}

    @Post('import-resource')
    async importResources(@Req() request: Request) {
        return this.ktqResourceService.importResources(request);
    }

    @Get()
    async getAll(@Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getAll(query);
    }

    @Get('roles/:role_id')
    async getResourcesByRole(@Param('role_id') role_id: KtqRole['id'], @Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getResourceByRole(role_id, query);
    }

    @Get('ignore-roles/:role_id')
    async getIgnoreResourcesByRole(@Param('role_id') role_id: KtqRole['id'], @Paginate() query: PaginateQuery) {
        return this.ktqResourceService.getIgnoreResourceByRole(role_id, query);
    }
}
