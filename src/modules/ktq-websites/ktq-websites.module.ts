import { TypeOrmModule } from '@nestjs/typeorm';
import KtqWebsite from '@/entities/ktq-websites.entity';
import { Module } from '@nestjs/common';
import { KtqWebsitesService } from './ktq-websites.service';

@Module({
  imports: [TypeOrmModule.forFeature([KtqWebsite])],
  providers: [KtqWebsitesService]

})
export class KtqWebsitesModule {}
