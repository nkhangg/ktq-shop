import KtqAppConstant from '@/constants/ktq-app.constant';
import { KtqAdminUsersService } from '@/modules/ktq-admin-users/ktq-admin-users.service';
import { KtqCachesService } from '@/modules/ktq-caches/services/ktq-caches.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import * as jwt from 'jsonwebtoken';
import { TTokenData } from '../decorators/token-data.decorator';
import { ConfirmPasswordAdmin } from '../dtos/ktq-admin-users.dto';
import KtqResponse from '../systems/response/ktq-response';
@Injectable()
export class BlockActionForRoot implements CanActivate {
    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const body = request.body as ConfirmPasswordAdmin;

        const authorization: string = request.headers['authorization'];

        const token = authorization.split(' ')[1];

        const decoded = jwt.decode(token) as TTokenData;

        const params = request?.params;
        const data = request.body;

        const request_admin_id = params?.id || data?.id;

        if (!decoded) {
            throw new UnauthorizedException(KtqResponse.toResponse(null, { message: `Unauthenticated`, status_code: HttpStatusCode.Unauthorized }));
        }

        if (request_admin_id === KtqAppConstant.getRootUserData().id) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `Unable to take action on this account`, status_code: HttpStatusCode.BadRequest }));
        }

        return true;
    }
}
