import { Test, TestingModule } from '@nestjs/testing';
import { KtqRolesController } from './ktq-roles.controller';

describe('KtqRolesController', () => {
  let controller: KtqRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqRolesController],
    }).compile();

    controller = module.get<KtqRolesController>(KtqRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
