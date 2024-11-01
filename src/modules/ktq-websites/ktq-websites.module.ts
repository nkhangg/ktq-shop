import { TypeOrmModule } from '@nestjs/typeorm';
import KtqWebsite from '@/entities/ktq-websites.entity';
import { Module } from '@nestjs/common';
import { KtqWebsitesService } from './ktq-websites.service';
import { KtqWebsitesController } from './controllers/ktq-websites/ktq-websites.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqWebsite])],
    providers: [KtqWebsitesService],
    controllers: [KtqWebsitesController],
})
export class KtqWebsitesModule {}
