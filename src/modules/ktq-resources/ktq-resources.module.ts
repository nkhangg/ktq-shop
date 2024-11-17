import { TypeOrmModule } from '@nestjs/typeorm';
import KtqResource from '@/entities/ktq-resources.entity';
import { Module } from '@nestjs/common';
import { KtqResourcesService } from './ktq-resources.service';
import { KtqAppConfigsModule } from '../ktq-app-configs/ktq-app-configs.module';
import { KtqResourcesController } from './ktq-resources.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqResource]), KtqAppConfigsModule],
    providers: [KtqResourcesService],
    controllers: [KtqResourcesController],
    exports: [KtqResourcesService],
})
export class KtqResourcesModule {}