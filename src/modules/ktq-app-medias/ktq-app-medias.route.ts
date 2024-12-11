import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqCustomer from '@/entities/ktq-customers.entity';

export const appMediasRoutes = (() => {
    const API_PREFIX = KtqConfigConstant.getApiPrefix().key_value;
    const API_VERSION = KtqConfigConstant.getApiVersion().key_value;
    const BASE = 'medias';

    const buildUrl = (...paths: string[]) => `/${API_PREFIX}/${API_VERSION}/${paths.join('/')}`;

    return {
        BASE,
        key: () => buildUrl(BASE),
        // avatar: (host = false) => KtqConfigConstant.getCustomerMediaPath('customer/avatar', host),
    };
})();
