import { KtqConfigEmailsService } from '@/modules/ktq-config-emails/ktq-config-emails.service';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('send-email')
export class EmailConsumer {
    constructor(private readonly ktqConfigMailService: KtqConfigEmailsService) {}

    @Process('forgot-password')
    async handleQueueForgotPassword({ data: { name, reset_link, to } }: Job<{ reset_link: string; to: string; name: string }>) {
        console.log({ name, reset_link, to });
        this.ktqConfigMailService.sendForgotPasswordEmail(to, name, reset_link);
    }
}
