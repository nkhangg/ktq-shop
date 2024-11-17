// queue.processor.ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { KtqConfigEmailsService } from '../ktq-config-emails/ktq-config-emails.service';
import KtqQueueConstant from '@/constants/ktq-queue.constant';

@Processor(KtqQueueConstant.QUEUE_NAME)
export class KtqQueueProcessor {
    constructor(private readonly ktqEmailService: KtqConfigEmailsService) {}

    @Process(KtqQueueConstant.QUEUE_FORGOT_PASSWORD)
    async handleSendEmail(job: Job) {
        const {
            data: { to, name, reset_link },
        } = job;
        this.ktqEmailService.sendForgotPasswordEmail(to, name, reset_link);
    }
}
