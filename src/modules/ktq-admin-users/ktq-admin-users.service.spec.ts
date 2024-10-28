import { Test, TestingModule } from '@nestjs/testing';
import { KtqAdminUsersService } from './ktq-admin-users.service';

describe('KtqAdminUsersService', () => {
  let service: KtqAdminUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqAdminUsersService],
    }).compile();

    service = module.get<KtqAdminUsersService>(KtqAdminUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
