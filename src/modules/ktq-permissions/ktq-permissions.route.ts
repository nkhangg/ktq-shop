import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqRole from '@/entities/ktq-roles.entity';

export const permissionRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/permissions';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        role: (role_id: KtqRole['id']) => buildUrl(BASE, 'roles', String(role_id)),
    };
})();
