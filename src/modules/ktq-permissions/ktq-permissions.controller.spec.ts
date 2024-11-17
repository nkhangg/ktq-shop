import { Test, TestingModule } from '@nestjs/testing';
import { KtqPermissionsController } from './ktq-permissions.controller';

describe('KtqPermissionsController', () => {
  let controller: KtqPermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqPermissionsController],
    }).compile();

    controller = module.get<KtqPermissionsController>(KtqPermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
