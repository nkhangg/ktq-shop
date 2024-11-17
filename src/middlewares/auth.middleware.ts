// auth.middleware.ts
import { TTokenData } from '@/common/decorators/token-data.decorator';
import { BackListType } from '@/common/enums/back-list-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { KtqSessionsService } from '@/modules/ktq-sessions/ktq-sessions.service';
import { HttpException, HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { Brackets, EntityManager } from 'typeorm';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly ktqSessionService: KtqSessionsService,
        private readonly entityManager: EntityManager,
    ) {}

    private table_name = 'ktq_user_black_lists';

    async use(req: Request, res: Response, next: NextFunction) {
        const authorization: string = req.headers['authorization'];

        if (!authorization) throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is valid', status_code: HttpStatus.UNAUTHORIZED }), HttpStatus.UNAUTHORIZED);

        if (authorization.split(' ').length <= 1)
            throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is valid', status_code: HttpStatus.UNAUTHORIZED }), HttpStatus.UNAUTHORIZED);

        const token = authorization.split(' ')[1];

        const prevTokenData: TTokenData = await this.jwtService.decode(token);

        const onBlackList: KtqUserBlackList | null = (await this.entityManager
            .getRepository(this.table_name)
            .createQueryBuilder(this.table_name)
            .where({ user_id_app: prevTokenData.id, back_list_type: BackListType.BLOCK, user_role_type: prevTokenData.class })
            .andWhere(`${this.table_name}.start_at <= CURRENT_TIMESTAMP`)
            .andWhere(
                new Brackets((qb) => {
                    qb.where(`${this.table_name}.end_at >= CURRENT_TIMESTAMP`).orWhere(`${this.table_name}.end_at IS NULL`);
                }),
            )
            .getOne()) as KtqUserBlackList;

        if (onBlackList) {
            throw new HttpException(KtqResponse.toResponse(null, { message: 'This account is blocked', status_code: 0 }), HttpStatus.FORBIDDEN);
        }

        try {
            const tokenData: TTokenData = await this.jwtService.verify(token);

            const session = await this.ktqSessionService.findByTokenData(tokenData);

            if (!session) throw new HttpException({}, HttpStatus.UNAUTHORIZED);
        } catch (error) {
            throw new HttpException(KtqResponse.toResponse(null, { message: 'Token is expired', status_code: HttpStatus.UNAUTHORIZED }), HttpStatus.UNAUTHORIZED);
        }

        next();
    }
}
