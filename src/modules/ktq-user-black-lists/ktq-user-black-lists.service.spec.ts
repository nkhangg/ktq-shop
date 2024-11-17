import { Test, TestingModule } from '@nestjs/testing';
import { KtqUserBlackListsService } from './ktq-user-black-lists.service';

describe('KtqUserBlackListsService', () => {
  let service: KtqUserBlackListsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqUserBlackListsService],
    }).compile();

    service = module.get<KtqUserBlackListsService>(KtqUserBlackListsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
