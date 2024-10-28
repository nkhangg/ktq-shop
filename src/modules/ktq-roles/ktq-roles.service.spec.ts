import { Test, TestingModule } from '@nestjs/testing';
import { KtqRolesService } from './ktq-roles.service';

describe('KtqRolesService', () => {
  let service: KtqRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqRolesService],
    }).compile();

    service = module.get<KtqRolesService>(KtqRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
