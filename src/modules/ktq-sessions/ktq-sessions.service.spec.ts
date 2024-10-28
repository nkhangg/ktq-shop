import { Test, TestingModule } from '@nestjs/testing';
import { KtqSessionsService } from './ktq-sessions.service';

describe('KtqSessionsService', () => {
  let service: KtqSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqSessionsService],
    }).compile();

    service = module.get<KtqSessionsService>(KtqSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
