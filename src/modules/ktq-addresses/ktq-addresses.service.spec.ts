import { Test, TestingModule } from '@nestjs/testing';
import { KtqAddressesService } from './ktq-addresses.service';

describe('KtqAddressesService', () => {
  let service: KtqAddressesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [KtqAddressesService],
    }).compile();

    service = module.get<KtqAddressesService>(KtqAddressesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
