import { GrantPermission } from '@/common/dtos/ktq-role-resources.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { KtqRoleResourcesService } from './ktq-role-resources.service';

@Controller('admin/role-resources')
export class KtqRoleResourcesController {
    constructor(private readonly ktqRoleResourceService: KtqRoleResourcesService) {}

    @Post('init-role-resources')
    async initRoleResources() {
        return await this.ktqRoleResourceService.initRoleResources();
    }

    @Post()
    async grantPermissions(@Body() data: GrantPermission) {
        return this.ktqRoleResourceService.grantPermissions(data);
    }
}
