import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';
import { PaginateQuery } from 'nestjs-paginate';
import GeneralKtqRoleDto from '@/common/dtos/ktq-roles.dto';
import KtqRole from '@/entities/ktq-roles.entity';
import { roleRoutes } from './ktq-role.route';

@Controller(roleRoutes.BASE)
export class KtqRolesController {
    constructor(private ktqRolesService: KtqRolesService) {}

    @Post('init-roles')
    public async initRoles() {
        return await this.ktqRolesService.initRoles();
    }

    @Get()
    public async getAll(@Param() query: PaginateQuery) {
        return await this.ktqRolesService.getAll(query);
    }

    @Post()
    public async create(@Body() data: GeneralKtqRoleDto) {
        return await this.ktqRolesService.createRole(data);
    }

    @Put(':id')
    public async update(@Param('id') id: KtqRole['id'], @Body() data: GeneralKtqRoleDto) {
        return await this.ktqRolesService.updateRole(id, data);
    }

    @Delete(':id')
    public async delete(@Param('id') id: KtqRole['id']) {
        return await this.ktqRolesService.deleteRole(id);
    }
}
