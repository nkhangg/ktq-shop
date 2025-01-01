// import KtqConfigConstant from '@/constants/ktq-configs.constant';
// import KtqResource from '@/entities/ktq-resources.entity';
// import KtqRole from '@/entities/ktq-roles.entity';

// export const resourcesRoutes = (() => {
//     const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
//     const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
//     const BASE = 'admin/resources';

//     const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

//     return {
//         BASE,
//         key: () => buildUrl(BASE),
//         role: (role_id: KtqRole['id']) => buildUrl(BASE, 'roles', String(role_id)),
//         ignoreRole: (role_id: KtqRole['id']) => buildUrl(BASE, 'ignore-roles', String(role_id)),
//         byId: (id: KtqResource['id']) => buildUrl(BASE, String(id)),
//     };
// })();

import KtqResource from '@/entities/ktq-resources.entity';
import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';
import KtqRole from '@/entities/ktq-roles.entity';

@Injectable()
export class KtqResourcesRoutes extends BaseRouteService {
    public static BASE = 'admin/resources';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqResourcesRoutes.BASE);
    }

    async role(role_id: KtqRole['id']) {
        return this.buildUrl(KtqResourcesRoutes.BASE, 'roles', String(role_id));
    }

    async ignoreRole(role_id: KtqRole['id']) {
        return this.buildUrl(KtqResourcesRoutes.BASE, 'ignore-roles', String(role_id));
    }

    async byId(id: KtqResource['id']) {
        return this.buildUrl(KtqResourcesRoutes.BASE, String(id));
    }
}
