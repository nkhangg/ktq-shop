// import KtqConfigConstant from '@/constants/ktq-configs.constant';
// import KtqResource from '@/entities/ktq-resources.entity';
// import KtqRole from '@/entities/ktq-roles.entity';

// export const resourcePermissionsRoutes = (() => {
//     const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
//     const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
//     const BASE = 'admin/resource-permissions';

//     const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

//     return {
//         BASE,
//         key: () => buildUrl(BASE),
//         resource: (resource_id: KtqResource['id']) => buildUrl(BASE, String(resource_id)),
//     };
// })();
import KtqResource from '@/entities/ktq-resources.entity';
import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';

@Injectable()
export class KtqResourcePermissionsRoutes extends BaseRouteService {
    public static BASE = 'admin/resource-permissions';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqResourcePermissionsRoutes.BASE);
    }

    async resource(resource_id: KtqResource['id']) {
        return this.buildUrl(KtqResourcePermissionsRoutes.BASE, String(resource_id));
    }
}
