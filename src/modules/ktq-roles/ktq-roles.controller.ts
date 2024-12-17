import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';
import { PaginateQuery } from 'nestjs-paginate';
import GeneralKtqRoleDto, { AddResourceForRoleKtqRoleDto, GetByAdminUserKtqRoleDto } from '@/common/dtos/ktq-roles.dto';
import KtqRole from '@/entities/ktq-roles.entity';
import { roleRoutes } from './ktq-role.route';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

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

    @Get('by-admin-user/:id')
    public async getByAdminUser(@Param('id') id: KtqAdminUser['id']) {
        return await this.ktqRolesService.getRoleByUserAdmin(id);
    }

    @Post()
    public async create(@Body() data: GeneralKtqRoleDto) {
        return await this.ktqRolesService.createRole(data);
    }

    @Post(':id')
    public async addResourceForRole(@Param('') id: KtqRole['id'], @Body() data: AddResourceForRoleKtqRoleDto) {
        return await this.ktqRolesService.addResourceForRole(id, data);
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
