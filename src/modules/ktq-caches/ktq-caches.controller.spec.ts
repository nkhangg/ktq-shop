import { Test, TestingModule } from '@nestjs/testing';
import { KtqCachesController } from './ktq-caches.controller';

describe('KtqCachesController', () => {
  let controller: KtqCachesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqCachesController],
    }).compile();

    controller = module.get<KtqCachesController>(KtqCachesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
