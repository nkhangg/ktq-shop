import { Test, TestingModule } from '@nestjs/testing';
import { KtqResourcesService } from './ktq-resources.service';

describe('KtqResourcesService', () => {
  let service: KtqResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqResourcesService],
    }).compile();

    service = module.get<KtqResourcesService>(KtqResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
