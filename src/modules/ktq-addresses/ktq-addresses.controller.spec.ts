import { Test, TestingModule } from '@nestjs/testing';
import { KtqAddressesController } from './ktq-addresses.controller';

describe('KtqAddressesController', () => {
  let controller: KtqAddressesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqAddressesController],
    }).compile();

    controller = module.get<KtqAddressesController>(KtqAddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
