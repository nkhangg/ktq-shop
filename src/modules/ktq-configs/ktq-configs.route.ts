import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqConfig from '@/entities/ktq-configs.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';

export const configsRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/configs';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        id: (id: KtqConfig['id']) => buildUrl(BASE, String(id)),
    };
})();
