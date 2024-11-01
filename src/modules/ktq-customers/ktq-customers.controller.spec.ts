import { Test, TestingModule } from '@nestjs/testing';
import { KtqCustomersController } from './ktq-customers.controller';

describe('KtqCustomersController', () => {
  let controller: KtqCustomersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqCustomersController],
    }).compile();

    controller = module.get<KtqCustomersController>(KtqCustomersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
