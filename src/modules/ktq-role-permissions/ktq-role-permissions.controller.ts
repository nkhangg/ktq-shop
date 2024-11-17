import { Controller, Post } from '@nestjs/common';
import { KtqRolePermissionsService } from './ktq-role-permissions.service';

@Controller('admin/role-permissions')
export class KtqRolePermissionsController {
    constructor(private readonly ktqRolePermissionService: KtqRolePermissionsService) {}

    @Post('init-role-permissions')
    async initRolePermission() {
        return await this.ktqRolePermissionService.initRolePermission();
    }
}
