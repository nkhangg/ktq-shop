import { Test, TestingModule } from '@nestjs/testing';
import { KtqResourcePermissionsService } from './ktq-resource-permissions.service';

describe('KtqResourcePermissionsService', () => {
  let service: KtqResourcePermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqResourcePermissionsService],
    }).compile();

    service = module.get<KtqResourcePermissionsService>(KtqResourcePermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
