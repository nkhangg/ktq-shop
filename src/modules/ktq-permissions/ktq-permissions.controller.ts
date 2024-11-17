import { Controller, Post } from '@nestjs/common';
import { KtqPermissionsService } from './ktq-permissions.service';

@Controller('admin/permissions')
export class KtqPermissionsController {
    constructor(private readonly ktqPermissionService: KtqPermissionsService) {}

    @Post('init-permissions')
    async initPermissions() {
        return await this.ktqPermissionService.initPermissions();
    }
}
