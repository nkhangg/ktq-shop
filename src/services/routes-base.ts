import { KtqConfigsService } from '@/modules/ktq-configs/ktq-configs.service';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class BaseRouteService {
    constructor(@Inject(forwardRef(() => KtqConfigsService)) protected configService: KtqConfigsService) {
        this.configService = configService;
    }
    // constructor(protected readonly configService: KtqConfigsService) {
    //     this.configService = configService;
    // }

    protected async buildUrl(...paths: string[]): Promise<string> {
        const prefix_version = await this.configService.getPrefixVersion();
        return `/${prefix_version}/${paths.join('/')}`;
    }
}
