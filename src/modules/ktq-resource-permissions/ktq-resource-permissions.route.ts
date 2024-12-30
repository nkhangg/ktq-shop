import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqRole from '@/entities/ktq-roles.entity';

export const resourcePermissionsRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/resource-permissions';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        resource: (resource_id: KtqResource['id']) => buildUrl(BASE, String(resource_id)),
    };
})();
