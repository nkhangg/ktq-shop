import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KtqConfigEmailsService {
    constructor(private readonly mailerService: MailerService) {}

    async sendForgotPasswordEmail(to: string, name: string, resetLink: string) {
        return await this.mailerService.sendMail({
            to,
            subject: 'Reset Your Password',
            template: 'forgot-password',
            context: {
                name,
                resetLink,
            },
        });
    }
}
