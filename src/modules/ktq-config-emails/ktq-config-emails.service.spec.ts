import { Test, TestingModule } from '@nestjs/testing';
import { KtqConfigEmailsService } from './ktq-config-emails.service';

describe('KtqConfigEmailsService', () => {
  let service: KtqConfigEmailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqConfigEmailsService],
    }).compile();

    service = module.get<KtqConfigEmailsService>(KtqConfigEmailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
