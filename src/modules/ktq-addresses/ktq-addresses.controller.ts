import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KtqAddressesService } from './ktq-addresses.service';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { CreateKtqAddressDto, DeleteKtqAddressDto, DeletesKtqAddressDto, SetDefaultKtqAddressDto, UpdateKtqAddressDto } from '@/common/dtos/ktq-addresses.dto';
import { adRoutes } from './ktq-address.route';

@Controller(adRoutes.BASE)
export class KtqAddressesController {
    constructor(private readonly ktqAddressService: KtqAddressesService) {}

    @Get('customer/:customer_id')
    async getByCustomer(@Param('customer_id') customer_id: KtqCustomer['id'], @Paginate() query: PaginateQuery) {
        return this.ktqAddressService.getByCustomer(customer_id, query);
    }

    @Post('customer/set-default')
    async setDefaultAddressByCustomer(@Body() { address_id, customer_id }: SetDefaultKtqAddressDto) {
        return this.ktqAddressService.setDefaultAddressByCustomer(address_id, customer_id);
    }

    @Post('customer/:customer_id')
    async createAddressByCustomer(@Param('customer_id') customer_id: KtqCustomer['id'], @Body() data: CreateKtqAddressDto) {
        return this.ktqAddressService.createAddressByCustomer({ customer_id, ...data });
    }

    @Put('customer/:customer_id')
    async updateAddressByCustomer(@Param('customer_id') customer_id: KtqCustomer['id'], @Body() data: UpdateKtqAddressDto) {
        return this.ktqAddressService.updateAddressByCustomer({ customer_id, ...data });
    }

    @Delete('customer/multiple')
    async deletesByCustomer(@Body() { address_ids, customer_id }: DeletesKtqAddressDto) {
        return this.ktqAddressService.deletesByCustomer(address_ids, customer_id);
    }

    @Delete('customer')
    async deleteByCustomer(@Body() { address_id, customer_id }: DeleteKtqAddressDto) {
        return this.ktqAddressService.deleteByCustomer(address_id, customer_id);
    }
}
