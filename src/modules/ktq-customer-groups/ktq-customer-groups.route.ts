import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';

@Injectable()
export class KtqCustomerGroupRoutes extends BaseRouteService {
    public static BASE = 'admin/customer-groups';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqCustomerGroupRoutes.BASE);
    }
}
