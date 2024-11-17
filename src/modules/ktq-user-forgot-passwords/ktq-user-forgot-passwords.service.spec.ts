import { Test, TestingModule } from '@nestjs/testing';
import { KtqUserForgotPasswordsService } from './ktq-user-forgot-passwords.service';

describe('KtqUserForgotPasswordsService', () => {
  let service: KtqUserForgotPasswordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqUserForgotPasswordsService],
    }).compile();

    service = module.get<KtqUserForgotPasswordsService>(KtqUserForgotPasswordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
