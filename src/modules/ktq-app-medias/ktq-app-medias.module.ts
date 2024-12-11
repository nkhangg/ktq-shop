import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { KtqAppMediasController } from './ktq-app-medias.controller';
import { KtqAppMediasService } from './ktq-app-medias.service';

@Module({
    imports: [],
    controllers: [KtqAppMediasController],
    providers: [KtqAppMediasService],
})
export class KtqAppMediasModule {}
