import { Test, TestingModule } from '@nestjs/testing';
import { KtqUserBlackListLogsService } from './ktq-user-black-list-logs.service';

describe('KtqUserBlackListLogsService', () => {
  let service: KtqUserBlackListLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqUserBlackListLogsService],
    }).compile();

    service = module.get<KtqUserBlackListLogsService>(KtqUserBlackListLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
