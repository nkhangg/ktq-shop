import { TypeOrmModule } from '@nestjs/typeorm';
import KtqSession from '@/entities/ktq-sessions.entity';
import { Module } from '@nestjs/common';
import { KtqSessionsService } from './ktq-sessions.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqSession])],
    providers: [KtqSessionsService],
    exports: [KtqSessionsService],
})
export class KtqSessionsModule {}
