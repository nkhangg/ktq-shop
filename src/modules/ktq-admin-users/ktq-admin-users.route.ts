import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

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

export const adminUserRoutes = (() => {
    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/admin-users';
    const BASE_USE_TIME_PASSWORD = buildUrl(BASE, 'admin_cache_password_time');

    return {
        BASE,
        BASE_USE_TIME_PASSWORD,
        key: () => buildUrl(BASE),
        byAdminUser: (admin_user_id: KtqAdminUser['id']) => buildUrl(BASE, `${admin_user_id}`),
        cacheKeyUseTimePassword: (requester_id: KtqAdminUser['id']) => `${BASE_USE_TIME_PASSWORD}-[${requester_id}]`,
    };
})();
