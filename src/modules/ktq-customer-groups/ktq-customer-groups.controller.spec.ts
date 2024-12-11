import { Test, TestingModule } from '@nestjs/testing';
import { KtqCustomerGroupsController } from './ktq-customer-groups.controller';

describe('KtqCustomerGroupsController', () => {
  let controller: KtqCustomerGroupsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqCustomerGroupsController],
    }).compile();

    controller = module.get<KtqCustomerGroupsController>(KtqCustomerGroupsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
