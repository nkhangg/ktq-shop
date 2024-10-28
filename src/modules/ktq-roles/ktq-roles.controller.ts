import { Controller, Post } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';

@Controller('ktq-roles')
export class KtqRolesController {
    constructor(private ktqRolesService: KtqRolesService) {}

    @Post('init-roles')
    public async initRoles() {
        return await this.ktqRolesService.initRoles();
    }
}
