import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { BaseRouteService } from '@/services/routes-base';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';
import { Injectable } from '@nestjs/common';

export function extractIds(inputString: string) {
    const regex = /admin_cache_password_time-\[(\d+)]/;
    const match = inputString.match(regex);

    if (match) {
        const requester_id = match[1];

        return {
            requester_id: requester_id,
        };
    }
    return null;
}

@Injectable()
export class KtqAdminUserRoutes extends BaseRouteService {
    public static BASE = 'admin/admin-users';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async useTimePassword() {
        return await this.buildUrl(KtqAdminUserRoutes.BASE, 'admin_cache_password_time');
    }

    public key() {
        return this.buildUrl(KtqAdminUserRoutes.BASE);
    }

    public byAdminUser(adminUserId: KtqAdminUser['id']) {
        return this.buildUrl(KtqAdminUserRoutes.BASE, `${adminUserId}`);
    }

    async cacheKeyUseTimePassword(requesterId: KtqAdminUser['id']) {
        const BASE_USE_TIME_PASSWORD = await this.useTimePassword();
        return `${BASE_USE_TIME_PASSWORD}-[${requesterId}]`;
    }
}
