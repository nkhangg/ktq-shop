import { Test, TestingModule } from '@nestjs/testing';
import { KtqCachesService } from './ktq-caches.service';

describe('KtqCachesService', () => {
  let service: KtqCachesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqCachesService],
    }).compile();

    service = module.get<KtqCachesService>(KtqCachesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
