import { TTokenData } from '@/common/decorators/token-data.decorator';
import { TypeResource } from '@/common/enums/type-resource.enum';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqPermissionsConstant from '@/constants/ktq-permission.constant';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import { KtqAdminUsersService } from '@/modules/ktq-admin-users/ktq-admin-users.service';
import { KtqResourcePermissionsService } from '@/modules/ktq-resource-permissions/ktq-resource-permissions.service';
import { ForbiddenException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpStatusCode } from 'axios';
import { NextFunction } from 'express';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
    constructor(
        private readonly jwtService: JwtService,
        private readonly ktqResourcePermissionService: KtqResourcePermissionsService,
        private readonly ktqAdminUserService: KtqAdminUsersService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const path = req.url.endsWith('/') ? req.url.slice(0, -1) : req.url;
        const method = req.method;

        const authorization: string = req.headers['authorization'];

        if (!authorization) {
            throw new ForbiddenException(KtqResponse.toResponse(null, { message: 'The forbidden', status_code: HttpStatusCode.Forbidden }));
        }

        const token = authorization.split(' ')[1];

        const tokenData: TTokenData = await this.jwtService.decode(token);

        if (tokenData.class === UserRoleType.CUSTOMER) {
            throw new ForbiddenException(KtqResponse.toResponse(null, { message: 'The forbidden', status_code: HttpStatusCode.Forbidden }));
        }

        const admin = await this.ktqAdminUserService.findOneWithRelation({
            where: { id: tokenData.id },
            relations: {
                role: {
                    rolePermissions: {
                        permission: true,
                        role: true,
                    },
                    roleResources: {
                        resource: true,
                        role: true,
                    },
                },
            },
        });

        if (!admin) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The user not found', status_code: HttpStatusCode.NotFound }));
        }

        // check if root NEXT
        if (admin.role.role_name === KtqRolesConstant.ROOT) {
            return next();
        }
        // if (
        //     admin.role.role_name === KtqRolesConstant.ROOT &&
        //     admin.role.rolePermissions.some((permission) => permission.permission.permission_code === KtqPermissionsConstant.getRootPermission().permission_code)
        // ) {
        //     return next();
        // }

        const curPermission = KtqPermissionsConstant.requestMappingRole(KtqPermissionsConstant.convertToRequestMethod(method));

        const permissions = admin.role.rolePermissions.map((item) => item.permission);
        const resources = admin.role.roleResources.map((item) => item.resource);

        const includePermission = permissions.some((permission) => permission.permission_code === curPermission.permission_code);
        const includeResource = resources.some((resource) => resource.resource_code === path && resource.resource_method === method && resource.type_resource === TypeResource.API);

        if (includeResource && includePermission) {
            return next();
        }

        const resourcePermission = await this.ktqResourcePermissionService.findOneWith({
            where: {
                adminUser: {
                    id: admin.id,
                },
                permission: {
                    permission_code: curPermission.permission_code,
                },
                resource: {
                    resource_code: path,
                    type_resource: TypeResource.API,
                    resource_method: method,
                },
            },
        });

        if (resourcePermission) {
            return next();
        }

        throw new ForbiddenException(KtqResponse.toResponse(null, { message: 'The forbidden', status_code: HttpStatusCode.Forbidden }));
    }
}
