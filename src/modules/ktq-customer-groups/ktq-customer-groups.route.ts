import KtqConfigConstant from '@/constants/ktq-configs.constant';

export const customerGroupRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/customer-groups';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
    };
})();
