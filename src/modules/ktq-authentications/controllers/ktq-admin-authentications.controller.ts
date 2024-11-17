import { TokenData, TTokenData } from '@/common/decorators/token-data.decorator';
import { AdminForgotPasswordDto, ChangePasswordForgot, LoginKtqAdminUserDto, RefreshTokenDto, RegisterKtqAdminUserDto } from '@/common/dtos/ktq-authentication.dto';
import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { KtqAuthenticationsService } from '../ktq-authentications.service';

@Controller('admin/auth')
export class KtqAdminAuthenticationsController {
    constructor(private readonly ktqAuthenticationService: KtqAuthenticationsService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: LoginKtqAdminUserDto, @Req() request: Request) {
        return await this.ktqAuthenticationService.adminLogin(data, request);
    }

    @Post('register')
    @HttpCode(200)
    async register(@Body() data: RegisterKtqAdminUserDto) {
        return await this.ktqAuthenticationService.adminRegister(data);
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@TokenData() tokendata: TTokenData) {
        return await this.ktqAuthenticationService.logout(tokendata);
    }

    @Get('me')
    @HttpCode(200)
    async getCurrentProfile(@TokenData() tokendata: TTokenData) {
        return await this.ktqAuthenticationService.getCurrentAdminProfile(tokendata);
    }

    @Post('refresh-token')
    @HttpCode(200)
    async refreshToken(@Body() body: RefreshTokenDto) {
        return await this.ktqAuthenticationService.adminRefreshToken(body);
    }

    @Post('forgot-password')
    @HttpCode(200)
    async forgotPassword(@Body() body: AdminForgotPasswordDto) {
        return await this.ktqAuthenticationService.adminForgotPassword(body);
    }

    @Post('grant-new-password')
    @HttpCode(200)
    async changePasswordForgot(@Body() body: ChangePasswordForgot) {
        return await this.ktqAuthenticationService.adminChangePasswordForgot(body);
    }
}
