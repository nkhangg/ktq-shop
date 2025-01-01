// import KtqConfigConstant from '@/constants/ktq-configs.constant';

// export const roleRoutes = (() => {
//     const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
//     const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
//     const BASE = 'admin/roles';

//     const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

//     return {
//         BASE,
//         key: () => buildUrl(BASE),
//     };
// })();

import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';

@Injectable()
export class KtqRoleRoutes extends BaseRouteService {
    public static BASE = 'admin/roles';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqRoleRoutes.BASE);
    }
}
