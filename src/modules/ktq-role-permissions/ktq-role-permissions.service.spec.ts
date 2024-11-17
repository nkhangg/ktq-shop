import { Test, TestingModule } from '@nestjs/testing';
import { KtqRolePermissionsService } from './ktq-role-permissions.service';

describe('KtqRolePermissionsService', () => {
  let service: KtqRolePermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqRolePermissionsService],
    }).compile();

    service = module.get<KtqRolePermissionsService>(KtqRolePermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
