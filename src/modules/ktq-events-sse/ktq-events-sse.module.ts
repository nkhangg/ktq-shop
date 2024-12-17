import { forwardRef, Module } from '@nestjs/common';
import { KtqEventsSseController } from './ktq-events-sse.controller';
import { KtqEventsSseService } from './ktq-events-sse.service';
import { KtqCachesModule } from '../ktq-caches/ktq-caches.module';

@Module({
    imports: [forwardRef(() => KtqCachesModule)],
    providers: [KtqEventsSseService],
    controllers: [KtqEventsSseController],
    exports: [KtqEventsSseService],
})
export class KtqEventsModule {}
