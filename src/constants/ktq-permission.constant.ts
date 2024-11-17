import { PermissionKey } from '@/common/enums/permission-key.enum';
import KtqPermission from '@/entities/ktq-permissions.entity';
import { RequestMethod } from '@nestjs/common';

export default class KtqPermissionsConstant {
    public static getPermissions() {
        return [
            {
                id: 1,
                description: 'Root something',
                permission_code: PermissionKey.ROOT,
            },
            {
                id: 2,
                description: 'Create something',
                permission_code: PermissionKey.CREATE,
            },
            {
                id: 3,
                description: 'Read something',
                permission_code: PermissionKey.READ,
            },
            {
                id: 4,
                description: 'Update something',
                permission_code: PermissionKey.UPDATE,
            },
            {
                id: 5,
                description: 'Delete something',
                permission_code: PermissionKey.DELETE,
            },
        ] as KtqPermission[];
    }

    public static getRootPermission() {
        return this.getPermissions().find((item) => item.permission_code === PermissionKey.ROOT);
    }

    public static getCreatePermission() {
        return this.getPermissions().find((item) => item.permission_code === PermissionKey.CREATE);
    }

    public static getReadPermission() {
        return this.getPermissions().find((item) => item.permission_code === PermissionKey.READ);
    }

    public static getUpdatePermission() {
        return this.getPermissions().find((item) => item.permission_code === PermissionKey.UPDATE);
    }

    public static getDeletePermission() {
        return this.getPermissions().find((item) => item.permission_code === PermissionKey.DELETE);
    }

    public static requestMappingRole(method: RequestMethod) {
        switch (method) {
            case RequestMethod.GET:
                return this.getReadPermission();
            case RequestMethod.DELETE:
                return this.getDeletePermission();
            case RequestMethod.POST:
                return this.getCreatePermission();
            case RequestMethod.PUT:
            case RequestMethod.PATCH:
                return this.getUpdatePermission();
            default:
                return null;
        }
    }

    public static convertToRequestMethod(method: string): RequestMethod {
        switch (method.toUpperCase()) {
            case 'GET':
                return RequestMethod.GET;
            case 'POST':
                return RequestMethod.POST;
            case 'PUT':
                return RequestMethod.PUT;
            case 'DELETE':
                return RequestMethod.DELETE;
            case 'PATCH':
                return RequestMethod.PATCH;
            case 'OPTIONS':
                return RequestMethod.OPTIONS;
            case 'HEAD':
                return RequestMethod.HEAD;
            default:
                return RequestMethod.ALL; // Hoặc giá trị mặc định nếu không khớp
        }
    }
}
