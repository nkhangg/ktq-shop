import { Injectable } from '@nestjs/common';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';
import { BaseRouteService } from '@/services/routes-base';

@Injectable()
export class KtqAddressRoutes extends BaseRouteService {
    public static BASE = 'admin/addresses';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async byCustomer(customerId: KtqCustomer['id']): Promise<string> {
        return this.buildUrl(KtqAddressRoutes.BASE, 'customer', `${customerId}`);
    }
}
