import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { ConfirmPasswordAdminGuard } from '@/common/guards/confirm-password-admin.guard';
import {
    ChangePasswordKtqAdminUserDto,
    ConfirmPasswordAdmin,
    CreateKtqAdminUserDto,
    IdsKtqAdminUserDto,
    SetNewPasswordKtqAdminUserDto,
    UpdateKtqAdminUserDto,
    UpdateRoleKtqAdminUserDto,
} from '@/common/dtos/ktq-admin-users.dto';
import { adminUserRoutes } from './ktq-admin-users.route';
import { TokenData, TTokenData } from '@/common/decorators/token-data.decorator';
import { CacheTTL } from '@nestjs/cache-manager';
import { BlockActionForRoot } from '@/common/guards/block-action-for-root.guard';

@Controller(adminUserRoutes.BASE)
export class KtqAdminUsersController {
    constructor(private readonly ktqAdminUserService: KtqAdminUsersService) {}

    @Post('init-configs')
    async initConfigs() {
        return await this.ktqAdminUserService.initRootAdmin();
    }

    @Get('')
    async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqAdminUserService.getAll(query);
    }

    @Get('use-time-password')
    @CacheTTL(30)
    async getUseTime(@TokenData() tokenData: TTokenData) {
        return await this.ktqAdminUserService.getUseTimePassword(tokenData);
    }

    @Get(':id')
    async getById(@Param('id') id: KtqAdminUser['id']) {
        return await this.ktqAdminUserService.getById(id);
    }

    @Put('in-actives')
    @UseGuards(ConfirmPasswordAdminGuard)
    async inActives(@Body() { ids }: IdsKtqAdminUserDto) {
        return await this.ktqAdminUserService.inActives(ids);
    }

    @Put('actives')
    @UseGuards(ConfirmPasswordAdminGuard)
    async actives(@Body() { ids }: IdsKtqAdminUserDto) {
        return await this.ktqAdminUserService.actives(ids);
    }

    @Put(':id/in-active')
    @UseGuards(ConfirmPasswordAdminGuard)
    async inActive(@Param('id') id: KtqAdminUser['id'], @Body() data: ConfirmPasswordAdmin) {
        return await this.ktqAdminUserService.inActive(id);
    }

    @Put(':id/active')
    @UseGuards(ConfirmPasswordAdminGuard)
    async active(@Param('id') id: KtqAdminUser['id'], @Body() data: ConfirmPasswordAdmin) {
        return await this.ktqAdminUserService.active(id);
    }

    @Delete('multiple')
    @UseGuards(ConfirmPasswordAdminGuard)
    async deletes(@Body() { ids }: IdsKtqAdminUserDto) {
        return await this.ktqAdminUserService.deletes(ids);
    }

    @Delete(':id')
    @UseGuards(ConfirmPasswordAdminGuard)
    async delete(@Param('id') id: KtqAdminUser['id'], @Body() data: ConfirmPasswordAdmin) {
        return await this.ktqAdminUserService.deleteAdminUser(id);
    }

    @Put(':id')
    @UseGuards(ConfirmPasswordAdminGuard)
    async updateAdminUser(@Param('id') id: KtqAdminUser['id'], @Body() data: UpdateKtqAdminUserDto) {
        return await this.ktqAdminUserService.updateAdminUser(id, data);
    }

    @Put('role/:id')
    @UseGuards(BlockActionForRoot, ConfirmPasswordAdminGuard)
    async updateRole(@Param('id') id: KtqAdminUser['id'], @Body() data: UpdateRoleKtqAdminUserDto) {
        return await this.ktqAdminUserService.updateRole(id, data);
    }

    @Put(':id/set-new-password')
    @UseGuards(ConfirmPasswordAdminGuard)
    async setNewPasswordAdminUser(@Param('id') id: KtqAdminUser['id'], @Body() data: SetNewPasswordKtqAdminUserDto) {
        return await this.ktqAdminUserService.setNewPassword(id, data);
    }

    @Post('')
    @UseGuards(ConfirmPasswordAdminGuard)
    async createNewAdminUser(@Body() data: CreateKtqAdminUserDto) {
        return await this.ktqAdminUserService.createNewAdminUser(data);
    }
}
