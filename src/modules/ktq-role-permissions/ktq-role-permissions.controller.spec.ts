import { Test, TestingModule } from '@nestjs/testing';
import { KtqRolePermissionsController } from './ktq-role-permissions.controller';

describe('KtqRolePermissionsController', () => {
  let controller: KtqRolePermissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqRolePermissionsController],
    }).compile();

    controller = module.get<KtqRolePermissionsController>(KtqRolePermissionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
