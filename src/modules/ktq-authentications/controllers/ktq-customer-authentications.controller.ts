import { TokenData, TTokenData } from '@/common/decorators/token-data.decorator';
import { LoginKtqCustomerDto, RefreshTokenDto, RegisterKtqCustomerDto } from '@/common/dtos/ktq-authentication.dto';
import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import { KtqAuthenticationsService } from '../ktq-authentications.service';
import { Request } from 'express';

@Controller('auth')
export class KtqCustomerAuthenticationsController {
    constructor(private readonly ktqAuthenticationService: KtqAuthenticationsService) {}

    @Post('login')
    @HttpCode(200)
    async login(@Body() data: LoginKtqCustomerDto, @Req() request: Request) {
        return await this.ktqAuthenticationService.customerLogin(data, request);
    }

    @Post('register')
    @HttpCode(200)
    async register(@Body() data: RegisterKtqCustomerDto) {
        return await this.ktqAuthenticationService.customerRegister(data);
    }

    @Post('logout')
    @HttpCode(200)
    async logout(@TokenData() tokendata: TTokenData) {
        return await this.ktqAuthenticationService.logout(tokendata);
    }

    @Get('me')
    @HttpCode(200)
    async getCurrentProfile(@TokenData() tokendata: TTokenData) {
        return await this.ktqAuthenticationService.getCurrentCustomerProfile(tokendata);
    }

    @Post('refresh-token')
    @HttpCode(200)
    async refreshToken(@Body() body: RefreshTokenDto) {
        return await this.ktqAuthenticationService.customerRefreshToken(body);
    }
}
