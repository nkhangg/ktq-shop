import { Test, TestingModule } from '@nestjs/testing';
import { KtqProvincesController } from './ktq-provinces.controller';

describe('KtqProvincesController', () => {
  let controller: KtqProvincesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqProvincesController],
    }).compile();

    controller = module.get<KtqProvincesController>(KtqProvincesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
