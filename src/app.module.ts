import { Module } from '@nestjs/common';
import { KtqAppConfigsModule } from './modules/ktq-app-configs/ktq-app-configs.module';
import { KtqConfigsModule } from './modules/ktq-configs/ktq-configs.module';
@Module({
  imports: [KtqAppConfigsModule, KtqConfigsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
