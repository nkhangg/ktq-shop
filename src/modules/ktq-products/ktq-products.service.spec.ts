import { Test, TestingModule } from '@nestjs/testing';
import { KtqProductsService } from './ktq-products.service';

describe('KtqProductsService', () => {
  let service: KtqProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqProductsService],
    }).compile();

    service = module.get<KtqProductsService>(KtqProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
