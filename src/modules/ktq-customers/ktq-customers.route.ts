import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqCustomer from '@/entities/ktq-customers.entity';

export const customersRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/customers';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        id: (id: KtqCustomer['id']) => buildUrl(BASE, String(id)),
    };
})();
