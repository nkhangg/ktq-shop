import { Test, TestingModule } from '@nestjs/testing';
import { KtqAppMediasController } from './ktq-app-medias.controller';

describe('KtqAppMediasController', () => {
  let controller: KtqAppMediasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KtqAppMediasController],
    }).compile();

    controller = module.get<KtqAppMediasController>(KtqAppMediasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
