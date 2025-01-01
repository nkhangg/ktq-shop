// import KtqConfigConstant from '@/constants/ktq-configs.constant';
// import KtqRole from '@/entities/ktq-roles.entity';

// export const permissionRoutes = (() => {
//     const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
//     const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
//     const BASE = 'admin/permissions';

//     const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

//     return {
//         BASE,
//         key: () => buildUrl(BASE),
//         role: (role_id: KtqRole['id']) => buildUrl(BASE, 'roles', String(role_id)),
//     };
// })();

import KtqRole from '@/entities/ktq-roles.entity';
import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';

@Injectable()
export class KtqPermissionsRoutes extends BaseRouteService {
    public static BASE = 'admin/permissions';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqPermissionsRoutes.BASE);
    }

    async role(role_id: KtqRole['id']) {
        return this.buildUrl(KtqPermissionsRoutes.BASE, 'roles', String(role_id));
    }
}
