import KtqCustomer from '@/entities/ktq-customers.entity';
import { BaseRouteService } from '@/services/routes-base';
import { Injectable } from '@nestjs/common';
import { KtqConfigsService } from '../ktq-configs/ktq-configs.service';

@Injectable()
export class KtqCustomersRoutes extends BaseRouteService {
    public static BASE = 'admin/customers';

    constructor(configService: KtqConfigsService) {
        super(configService);
    }

    async key() {
        return this.buildUrl(KtqCustomersRoutes.BASE);
    }

    async id(id: KtqCustomer['id']) {
        return this.buildUrl(KtqCustomersRoutes.BASE, String(id));
    }
}
