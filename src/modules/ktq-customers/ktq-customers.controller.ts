import { Body, Controller, Get, Param } from '@nestjs/common';
import { KtqCustomersService } from './ktq-customers.service';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('customers')
export class KtqCustomersController {
    constructor(private readonly ktqCustomerService: KtqCustomersService) {}

    @Get(':id')
    public async getById(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.getById(id);
    }

    @Get('')
    public async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqCustomerService.getAll(query);
    }
}
