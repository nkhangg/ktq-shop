import { Controller, Get, Post } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@Controller('admin/admin-users')
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
}
