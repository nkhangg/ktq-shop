import { Test, TestingModule } from '@nestjs/testing';
import { KtqPermissionsService } from './ktq-permissions.service';

describe('KtqPermissionsService', () => {
  let service: KtqPermissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqPermissionsService],
    }).compile();

    service = module.get<KtqPermissionsService>(KtqPermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
