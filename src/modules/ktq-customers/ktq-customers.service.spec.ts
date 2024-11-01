import { Test, TestingModule } from '@nestjs/testing';
import { KtqCustomersService } from './ktq-customers.service';

describe('KtqCustomersService', () => {
  let service: KtqCustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqCustomersService],
    }).compile();

    service = module.get<KtqCustomersService>(KtqCustomersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
