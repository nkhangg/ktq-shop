import { TypeOrmModule } from '@nestjs/typeorm';
import KtqUserForgotPassword from '@/entities/ktq-user-forgot-passwords.entity';
import { Module } from '@nestjs/common';
import { KtqUserForgotPasswordsService } from './ktq-user-forgot-passwords.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqUserForgotPassword])],
    providers: [KtqUserForgotPasswordsService],
    exports: [KtqUserForgotPasswordsService],
})
export class KtqUserForgotPasswordsModule {}
