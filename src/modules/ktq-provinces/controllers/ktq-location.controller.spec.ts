import { Test, TestingModule } from '@nestjs/testing';
import { KtqLocationController } from './ktq-location.controller';

describe('KtqLocationController', () => {
  let controller: KtqLocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqLocationController],
    }).compile();

    controller = module.get<KtqLocationController>(KtqLocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
