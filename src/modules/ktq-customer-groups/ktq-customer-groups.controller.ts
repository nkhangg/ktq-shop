import GeneralKtqCustomerGroupDto from '@/common/dtos/ktq-customer-groups.dto';
import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqCustomerGroupRoutes } from './ktq-customer-groups.route';
import { KtqCustomerGroupsService } from './ktq-customer-groups.service';

@Controller(KtqCustomerGroupRoutes.BASE)
export class KtqCustomerGroupsController {
    constructor(private readonly ktqCustomerGroupsService: KtqCustomerGroupsService) {}

    @Post('init-customer-groups')
    async initCustomerGroups() {
        return this.ktqCustomerGroupsService.initCustomerGroups();
    }

    @Get('')
    async getAll(@Paginate() query: PaginateQuery) {
        return this.ktqCustomerGroupsService.getAll(query);
    }

    @Post('')
    async createCustomerGroup(@Body() data: GeneralKtqCustomerGroupDto) {
        return this.ktqCustomerGroupsService.createCustomerGroup(data);
    }

    @Put(':id')
    async updateCustomerGroup(@Param('id') id: KtqCustomerGroup['id'], @Body() data: GeneralKtqCustomerGroupDto) {
        return this.ktqCustomerGroupsService.updateCustomerGroup(id, data);
    }

    @Delete(':id')
    async deleteCustomerGroup(@Param('id') id: KtqCustomerGroup['id']) {
        return this.ktqCustomerGroupsService.deleteCustomerGroup(id);
    }
}
