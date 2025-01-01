import { BlockKtqAdminUserDto, BlockKtqCustomerDto, BlockKtqCustomersDto, UnlockKtqAdminUserDto, UnlockKtqCustomerDto } from '@/common/dtos/ktq-user-black-lists.dto';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';
import { ConfirmPasswordAdminGuard } from '@/common/guards/confirm-password-admin.guard';
import { KtqUserBlackListsRoutes } from './ktq-user-black-lists.route';

@Controller(KtqUserBlackListsRoutes.BASE)
@CacheTTL(10000)
export class KtqUserBlackListsController {
    constructor(private readonly ktqUserBlackListsService: KtqUserBlackListsService) {}

    @Get('admin-user/:id')
    async getByAdminUserId(@Param('id') id: KtqAdminUser['id']) {
        return await this.ktqUserBlackListsService.getBlockAdminId(id);
    }

    @Post('multiple')
    async blockCustomers(@Body() data: BlockKtqCustomersDto) {
        return await this.ktqUserBlackListsService.blockCustomers(data);
    }

    @Post('block-customer')
    async blockCustomer(@Body() data: BlockKtqCustomerDto) {
        return await this.ktqUserBlackListsService.blockCustomer(data);
    }

    @Post('block-admin-user')
    @UseGuards(ConfirmPasswordAdminGuard)
    async blockAdminUser(@Body() data: BlockKtqAdminUserDto) {
        return await this.ktqUserBlackListsService.blockAdminUser(data);
    }

    @Put('unlock-customer')
    async unlockCustomer(@Body() data: UnlockKtqCustomerDto) {
        return await this.ktqUserBlackListsService.unlockCustomer(data.customer_id);
    }

    @Put('unlock-admin-user')
    @UseGuards(ConfirmPasswordAdminGuard)
    async unlockAdminUser(@Body() data: UnlockKtqAdminUserDto) {
        return await this.ktqUserBlackListsService.unlockAdminUser(data.admin_user_id);
    }
}
