import KtqResource from '@/entities/ktq-resources.entity';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { resourcePermissionsRoutes } from './ktq-resource-permissions.route';
import { KtqResourcePermissionsService } from './ktq-resource-permissions.service';
import { CreateResourcePermission, DeleteResourcePermission } from '@/common/dtos/ktq-resource-permissions.dto';

@Controller(resourcePermissionsRoutes.BASE)
export class KtqResourcePermissionsController {
    constructor(private readonly ktqResourcePermissionsService: KtqResourcePermissionsService) {}

    @Get(':resource_id')
    async findAll(@Param('resource_id') resource_id: KtqResource['id'], @Paginate() query: PaginateQuery) {
        return this.ktqResourcePermissionsService.getAll(resource_id, query);
    }

    @Post()
    async createResourcePermission(@Body() data: CreateResourcePermission) {
        return this.ktqResourcePermissionsService.createResourcePermission(data);
    }

    @Delete(':id')
    async deleteResourcePermission(@Param('id') id: KtqResource['id'], @Body() { resource_id }: DeleteResourcePermission) {
        return this.ktqResourcePermissionsService.deleteResourcePermission(id, resource_id);
    }
}
