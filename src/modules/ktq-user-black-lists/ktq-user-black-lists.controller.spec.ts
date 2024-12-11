import { Test, TestingModule } from '@nestjs/testing';
import { KtqUserBlackListsController } from './ktq-user-black-lists.controller';

describe('KtqUserBlackListsController', () => {
  let controller: KtqUserBlackListsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqUserBlackListsController],
    }).compile();

    controller = module.get<KtqUserBlackListsController>(KtqUserBlackListsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
