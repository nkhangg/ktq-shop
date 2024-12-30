import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqRole from '@/entities/ktq-roles.entity';

export const resourcesRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/resources';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        role: (role_id: KtqRole['id']) => buildUrl(BASE, 'roles', String(role_id)),
        ignoreRole: (role_id: KtqRole['id']) => buildUrl(BASE, 'ignore-roles', String(role_id)),
        byId: (id: KtqResource['id']) => buildUrl(BASE, String(id)),
    };
})();
