import { Body, Controller, Param, Post, Put } from '@nestjs/common';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';
import { BlockKtqCustomerDto, BlockKtqCustomersDto, UnlockKtqCustomerDto } from '@/common/dtos/ktq-user-black-lists.dto';
import { CacheTTL } from '@nestjs/cache-manager';
import KtqCustomer from '@/entities/ktq-customers.entity';

@Controller('admin/black-lists')
@CacheTTL(10000)
export class KtqUserBlackListsController {
    constructor(private readonly ktqUserBlackListsService: KtqUserBlackListsService) {}

    @Post('multiple')
    async blockCustomers(@Body() data: BlockKtqCustomersDto) {
        return this.ktqUserBlackListsService.blockCustomers(data);
    }

    @Post('block-customer')
    async blockCustomer(@Body() data: BlockKtqCustomerDto) {
        return this.ktqUserBlackListsService.blockCustomer(data);
    }

    @Put('unlock-customer')
    async unlockCustomer(@Body() data: UnlockKtqCustomerDto) {
        return this.ktqUserBlackListsService.unlockCustomer(data.customer_id);
    }
}
