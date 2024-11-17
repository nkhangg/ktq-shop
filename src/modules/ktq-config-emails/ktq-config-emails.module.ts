import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join, resolve } from 'path';
import { KtqConfigEmailsService } from './ktq-config-emails.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('MAIL_HOST'),
                    port: config.get<number>('MAIL_PORT'),
                    secure: true,
                    auth: {
                        user: config.get('MAIL_USERNAME'),
                        pass: config.get('MAIL_PASSWORD'),
                    },
                },
                defaults: {
                    from: config.get('MAIL_FROM_ADDRESS'),
                },
                template: {
                    dir: process.cwd() + '/src/templates/',
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: false,
                    },
                },
            }),
        }),
    ],
    providers: [KtqConfigEmailsService],
    exports: [KtqConfigEmailsService],
})
export class KtqConfigEmailsModule {}
