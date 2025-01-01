import KtqCustomer from '@/entities/ktq-customers.entity';
import { BaseRouteService } from '@/services/routes-base';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';

@Injectable()
export class KtqConfigsRoutes {
    public static BASE = 'admin/configs';
    public static PUBLIC = 'configs';

    constructor(@Inject(forwardRef(() => KtqConfigsService)) protected configService: KtqConfigsService) {
        this.configService = configService;
    }

    protected async buildUrl(...paths: string[]): Promise<string> {
        const prefix_version = await this.configService.getPrefixVersion();
        return `/${prefix_version}/${paths.join('/')}`;
    }

    async key() {
        return this.buildUrl(KtqConfigsRoutes.BASE);
    }

    async public_key_name(key_name: string) {
        return this.buildUrl(KtqConfigsRoutes.PUBLIC, key_name);
    }

    async public_keys() {
        return this.buildUrl(KtqConfigsRoutes.PUBLIC);
    }
}
