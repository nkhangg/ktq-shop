import { Test, TestingModule } from '@nestjs/testing';
import { KtqWebsitesService } from './ktq-websites.service';

describe('KtqWebsitesService', () => {
  let service: KtqWebsitesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqWebsitesService],
    }).compile();

    service = module.get<KtqWebsitesService>(KtqWebsitesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
