import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';

export const userBlackListsRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/black-lists';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        byAdminUser: (admin_user_id: KtqAdminUser['id']) => buildUrl(BASE, 'admin-user', `${admin_user_id}`),
    };
})();
