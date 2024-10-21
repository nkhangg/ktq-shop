import { Module } from '@nestjs/common';
import { KtqAppConfigsModule } from './modules/ktq-app-configs/ktq-app-configs.module';
import { KtqConfigsModule } from './modules/ktq-configs/ktq-configs.module';
import { KtqProductsModule } from './modules/ktq-products/ktq-products.module';

@Module({
    imports: [KtqAppConfigsModule, KtqConfigsModule, KtqProductsModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
