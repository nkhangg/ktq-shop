import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KtqCustomersService } from './ktq-customers.service';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import GeneralKtqCustomerDto, { DeletesKtqCustomerDto } from '@/common/dtos/ktq-customers.dto';

@Controller('admin/customers')
export class KtqCustomersController {
    constructor(private readonly ktqCustomerService: KtqCustomersService) {}

    @Get(':id')
    public async getById(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.getById(id);
    }

    @Get()
    public async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqCustomerService.getAll(query);
    }

    @Put(':id')
    public async update(@Param('id') id: KtqCustomer['id'], @Body() data: GeneralKtqCustomerDto) {
        return await this.ktqCustomerService.updateById(id, data);
    }

    @Delete('multiple')
    public async deletes(@Body() { ids }: DeletesKtqCustomerDto) {
        return await this.ktqCustomerService.deletes(ids);
    }
}
