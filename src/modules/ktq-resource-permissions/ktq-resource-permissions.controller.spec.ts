import { Test, TestingModule } from '@nestjs/testing';
import { KtqResourcePermissionsController } from './ktq-resource-permissions.controller';

describe('KtqResourcePermissionsController', () => {
  let controller: KtqResourcePermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqResourcePermissionsController],
    }).compile();

    controller = module.get<KtqResourcePermissionsController>(KtqResourcePermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
