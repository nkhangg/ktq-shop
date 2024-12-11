import { Controller, Get, Headers, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { KtqAppMediasService } from './ktq-app-medias.service';

@Controller('medias')
export class KtqAppMediasController {
    constructor(private readonly ktqAppMediasService: KtqAppMediasService) {}

    @Get('customer/avatar/:filename')
    async getAvatar(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = await this.ktqAppMediasService.getCustomerMedia(filename);

        return res.sendFile(filePath);
    }

    @Get('customer/cover/:filename')
    async getBgCover(@Param('filename') filename: string, @Res() res: Response) {
        const filePath = await this.ktqAppMediasService.getCustomerMedia(filename);

        return res.sendFile(filePath);
    }
}
