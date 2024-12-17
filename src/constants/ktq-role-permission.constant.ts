import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqRolesConstant from './ktq-roles.constant';
import KtqPermissionsConstant from './ktq-permission.constant';

export default class KtqRolePermissionConstant {
    private static rootRole = KtqRolesConstant.getRoot();
    private static superAdminRole = KtqRolesConstant.getSuperAdmin();
    private static managementRole = KtqRolesConstant.getManagement();
    private static normalRole = KtqRolesConstant.getNormalAdmin();

    // private static rootPermission = KtqPermissionsConstant.getRootPermission();
    private static createPermission = KtqPermissionsConstant.getCreatePermission();
    private static readPermission = KtqPermissionsConstant.getReadPermission();
    private static updatePermission = KtqPermissionsConstant.getUpdatePermission();
    private static deletePermission = KtqPermissionsConstant.getDeletePermission();

    public static getRolePermissions() {
        return [
            // {
            //     id: 1,
            //     role: this.rootRole,
            //     permission: this.rootPermission,
            // },
            {
                id: 1,
                role: this.managementRole,
                permission: this.createPermission,
            },
            {
                id: 2,
                role: this.managementRole,
                permission: this.readPermission,
            },
            {
                id: 3,
                role: this.managementRole,
                permission: this.updatePermission,
            },
            {
                id: 4,
                role: this.managementRole,
                permission: this.deletePermission,
            },
            {
                id: 5,
                role: this.normalRole,
                permission: this.createPermission,
            },
            {
                id: 6,
                role: this.normalRole,
                permission: this.readPermission,
            },
            {
                id: 7,
                role: this.normalRole,
                permission: this.updatePermission,
            },
        ] as KtqRolePermission[];
    }
}
