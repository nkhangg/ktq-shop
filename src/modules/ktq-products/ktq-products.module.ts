import { Module } from '@nestjs/common';
import { KtqProductsService } from './ktq-products.service';

@Module({
  providers: [KtqProductsService]
})
export class KtqProductsModule {}
