import { Test, TestingModule } from '@nestjs/testing';
import { KtqSessionsController } from './ktq-sessions.controller';

describe('KtqSessionsController', () => {
  let controller: KtqSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqSessionsController],
    }).compile();

    controller = module.get<KtqSessionsController>(KtqSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
