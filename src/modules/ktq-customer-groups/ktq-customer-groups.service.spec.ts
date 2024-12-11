import { Test, TestingModule } from '@nestjs/testing';
import { KtqCustomerGroupsService } from './ktq-customer-groups.service';

describe('KtqCustomerGroupsService', () => {
  let service: KtqCustomerGroupsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqCustomerGroupsService],
    }).compile();

    service = module.get<KtqCustomerGroupsService>(KtqCustomerGroupsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
