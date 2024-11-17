import { Test, TestingModule } from '@nestjs/testing';
import { KtqRoleResourcesService } from './ktq-role-resources.service';

describe('KtqRoleResourcesService', () => {
  let service: KtqRoleResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqRoleResourcesService],
    }).compile();

    service = module.get<KtqRoleResourcesService>(KtqRoleResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
