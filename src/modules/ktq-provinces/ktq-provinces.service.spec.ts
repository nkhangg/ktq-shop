import { Test, TestingModule } from '@nestjs/testing';
import { KtqProvincesService } from './ktq-provinces.service';

describe('KtqProvincesService', () => {
  let service: KtqProvincesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqProvincesService],
    }).compile();

    service = module.get<KtqProvincesService>(KtqProvincesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
