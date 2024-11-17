import { Test, TestingModule } from '@nestjs/testing';
import { KtqAppConfigsController } from './ktq-app-configs.controller';

describe('KtqAppConfigsController', () => {
  let controller: KtqAppConfigsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqAppConfigsController],
    }).compile();

    controller = module.get<KtqAppConfigsController>(KtqAppConfigsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
