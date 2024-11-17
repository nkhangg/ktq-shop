import { Test, TestingModule } from '@nestjs/testing';
import { KtqQueuesService } from './ktq-queues.service';

describe('KtqQueuesService', () => {
  let service: KtqQueuesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqQueuesService],
    }).compile();

    service = module.get<KtqQueuesService>(KtqQueuesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
