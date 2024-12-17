import { Test, TestingModule } from '@nestjs/testing';
import { KtqEventsController } from './ktq-events-sse.controller';

describe('KtqEventsController', () => {
    let controller: KtqEventsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [KtqEventsController],
        }).compile();

        controller = module.get<KtqEventsController>(KtqEventsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
