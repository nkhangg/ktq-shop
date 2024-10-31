import { Controller, Post } from '@nestjs/common';
import { KtqAdminUsersService } from './ktq-admin-users.service';

@Controller('ktq-admin-users')
export class KtqAdminUsersController {
    constructor(private readonly ktqAdminUserService: KtqAdminUsersService) {}

    @Post('init-configs')
    async initConfigs() {
        return await this.ktqAdminUserService.initRootAdmin();
    }
}
