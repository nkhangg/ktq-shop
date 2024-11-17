import { Test, TestingModule } from '@nestjs/testing';
import { KtqAppConfigsService } from './ktq-app-configs.service';

describe('KtqAppConfigsService', () => {
  let service: KtqAppConfigsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqAppConfigsService],
    }).compile();

    service = module.get<KtqAppConfigsService>(KtqAppConfigsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
