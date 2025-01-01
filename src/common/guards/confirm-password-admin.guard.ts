import { KtqAdminUserRoutes } from '@/modules/ktq-admin-users/ktq-admin-users.route';
import { KtqAdminUsersService } from '@/modules/ktq-admin-users/ktq-admin-users.service';
import { KtqCachesService } from '@/modules/ktq-caches/services/ktq-caches.service';
import { BadRequestException, CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { HttpStatusCode } from 'axios';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { TTokenData } from '../decorators/token-data.decorator';
import { ConfirmPasswordAdmin } from '../dtos/ktq-admin-users.dto';
import KtqResponse from '../systems/response/ktq-response';
@Injectable()
export class ConfirmPasswordAdminGuard implements CanActivate {
    constructor(
        private readonly ktqAdminUserService: KtqAdminUsersService,
        private readonly ktqCacheService: KtqCachesService,
        private readonly ktqAdminUserRoutes: KtqAdminUserRoutes,
    ) {}

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
            throw new UnauthorizedException(KtqResponse.toResponse(null, { message: `Unauthenticated` }));
        }

        const cache_key = await this.ktqAdminUserRoutes.cacheKeyUseTimePassword(decoded.id);

        const passwordInCache = await this.ktqCacheService.getCache<string>(cache_key);

        if (passwordInCache) {
            return true;
        }

        if (!body?.admin_password) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `admin_password is required`, status_code: HttpStatusCode.BadRequest }));
        }

        const admin = await this.ktqAdminUserService.findOne(decoded.id);

        if (!admin) throw new NotFoundException(KtqResponse.toResponse(null, { message: "Can't found admin", status_code: HttpStatusCode.NotFound }));

        const result = bcrypt.compareSync(body.admin_password, admin.password_hash);

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `Password is correct` }));
        }

        if (body.use_time) {
            await this.ktqCacheService.setCache<string>(cache_key, JSON.stringify({ request_admin_id: request_admin_id, requester_id: decoded.id }), 300000);
            // await this.ktqCacheService.setCache<string>(cache_key, bcrypt.hashSync(body.admin_password), 300000);

            if (request_admin_id) {
                const prefixCache = await this.ktqAdminUserRoutes.byAdminUser(request_admin_id);
                console.log(prefixCache);
                await this.ktqCacheService.clearKeysByPrefix(prefixCache);
            }
        }

        return result;
    }
}
