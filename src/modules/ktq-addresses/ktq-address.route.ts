import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqCustomer from '@/entities/ktq-customers.entity';

export const adRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'admin/addresses';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        byCustomer: (customerId: KtqCustomer['id']) => buildUrl(BASE, 'customer', `${customerId}`),
    };
})();
