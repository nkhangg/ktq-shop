import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { KtqPermissionsService } from './ktq-permissions.service';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import KtqRole from '@/entities/ktq-roles.entity';
import { AddPermissionForRoleData } from '@/common/dtos/ktq-permissions.dto';
import { permissionRoutes } from './ktq-permissions.route';

@Controller(permissionRoutes.BASE)
export class KtqPermissionsController {
    constructor(private readonly ktqPermissionService: KtqPermissionsService) {}

    @Post('init-permissions')
    async initPermissions() {
        return await this.ktqPermissionService.initPermissions();
    }

    @Get('')
    async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqPermissionService.getAll(query);
    }

    @Get('roles/:role_id')
    async getPermissionByRole(@Param('role_id') role_id: KtqRole['id']) {
        return await this.ktqPermissionService.getPermissionByRole(role_id);
    }

    @Post('roles/:role_id')
    async addPermissionForRole(@Param('role_id') role_id: KtqRole['id'], @Body() data: AddPermissionForRoleData) {
        return await this.ktqPermissionService.addPermissionForRole(role_id, data);
    }

    @Delete('roles/:role_id')
    async deletePermissionFormRole(@Param('role_id') role_id: KtqRole['id'], @Body() data: AddPermissionForRoleData) {
        return await this.ktqPermissionService.removePermissionFormRole(role_id, data);
    }
}
