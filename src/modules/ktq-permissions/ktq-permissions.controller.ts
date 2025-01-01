import { AddPermissionForRoleData } from '@/common/dtos/ktq-permissions.dto';
import KtqRole from '@/entities/ktq-roles.entity';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqPermissionsRoutes } from './ktq-permissions.route';
import { KtqPermissionsService } from './ktq-permissions.service';

@Controller(KtqPermissionsRoutes.BASE)
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
