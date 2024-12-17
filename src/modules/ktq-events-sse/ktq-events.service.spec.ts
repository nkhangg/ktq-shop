import { Test, TestingModule } from '@nestjs/testing';
import { KtqEventsService } from './ktq-events-sse.service';

describe('KtqEventsService', () => {
    let service: KtqEventsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [KtqEventsService],
        }).compile();

        service = module.get<KtqEventsService>(KtqEventsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
