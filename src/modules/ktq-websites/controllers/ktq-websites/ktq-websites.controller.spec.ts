import { Test, TestingModule } from '@nestjs/testing';
import { KtqWebsitesController } from './ktq-websites.controller';

describe('KtqWebsitesController', () => {
  let controller: KtqWebsitesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqWebsitesController],
    }).compile();

    controller = module.get<KtqWebsitesController>(KtqWebsitesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
