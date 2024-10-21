import { Module } from '@nestjs/common';
import { KtqConfigsController } from './ktq-configs.controller';
import { KtqConfigsService } from './ktq-configs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import KtqConfig from '@/entities/ktq-configs.entity';

@Module({
    imports: [TypeOrmModule.forFeature([KtqConfig])],
    controllers: [KtqConfigsController],
    providers: [KtqConfigsService],
})
export class KtqConfigsModule {}