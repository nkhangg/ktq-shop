import { Test, TestingModule } from '@nestjs/testing';
import { KtqAppMediasService } from './ktq-app-medias.service';

describe('KtqAppMediasService', () => {
  let service: KtqAppMediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqAppMediasService],
    }).compile();

    service = module.get<KtqAppMediasService>(KtqAppMediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
