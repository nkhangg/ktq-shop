import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { KtqEventsSseService } from './ktq-events-sse.service';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

@Controller('events-sse')
export class KtqEventsSseController {
    constructor(private readonly eventsService: KtqEventsSseService) {}

    @Get('use-time-password-expired/:id')
    useTimePasswordExpired(@Res() res: Response, @Param('id') id: KtqAdminUser['id']) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        this.eventsService.addClient(res, 'use-time-password-expired', String(id));
    }
}
