import { Test, TestingModule } from '@nestjs/testing';
import { KtqAdminUsersController } from './ktq-admin-users.controller';

describe('KtqAdminUsersController', () => {
  let controller: KtqAdminUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqAdminUsersController],
    }).compile();

    controller = module.get<KtqAdminUsersController>(KtqAdminUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
