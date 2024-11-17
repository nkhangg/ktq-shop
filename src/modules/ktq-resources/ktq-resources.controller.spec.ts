import { Test, TestingModule } from '@nestjs/testing';
import { KtqResourcesController } from './ktq-resources.controller';

describe('KtqResourcesController', () => {
  let controller: KtqResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqResourcesController],
    }).compile();

    controller = module.get<KtqResourcesController>(KtqResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
