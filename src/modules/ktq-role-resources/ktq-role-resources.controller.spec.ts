import { Test, TestingModule } from '@nestjs/testing';
import { KtqRoleResourcesController } from './ktq-role-resources.controller';

describe('KtqRoleResourcesController', () => {
  let controller: KtqRoleResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqRoleResourcesController],
    }).compile();

    controller = module.get<KtqRoleResourcesController>(KtqRoleResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
