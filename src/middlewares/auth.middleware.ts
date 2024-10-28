// auth.middleware.ts
import { TTokenData } from '@/common/decorators/token-data.decorator';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import { KtqSessionsService } from '@/modules/ktq-sessions/ktq-sessions.service';
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly ktqSessionService: KtqSessionsService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const authorization: string = req.headers['authorization'];

        if (!authorization) throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is valid', status_code: HttpStatus.FORBIDDEN }), HttpStatus.FORBIDDEN);

        if (authorization.split(' ').length <= 1)
            throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is valid', status_code: HttpStatus.FORBIDDEN }), HttpStatus.FORBIDDEN);

        const token = authorization.split(' ')[1];

        try {
            const tokenData: TTokenData = await this.jwtService.verify(token);

            const session = await this.ktqSessionService.findByTokenData(tokenData);

            if (!session) throw new HttpException({}, HttpStatus.FORBIDDEN);
        } catch (error) {
            throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is expired', status_code: HttpStatus.FORBIDDEN }), HttpStatus.FORBIDDEN);
        }

        next();
    }
}
