import KtqRole from '@/entities/ktq-roles.entity';

export default class KtqRolesConstant {
    public static ROOT = 'ROOT';
    public static SUPER_ADMIN = 'Super admin';
    public static MANAGEMENT = 'Management';
    public static NORMAL_ADMIN = 'Normal admin';

    public static getRoles() {
        return [
            {
                id: 1,
                role_name: this.ROOT,
            },
            {
                id: 2,
                role_name: this.SUPER_ADMIN,
            },
            {
                id: 3,
                role_name: this.MANAGEMENT,
            },
            {
                id: 4,
                role_name: this.NORMAL_ADMIN,
            },
        ] as KtqRole[];
    }

    public static getRoot() {
        return this.getRoles().find((role) => role.role_name === this.ROOT);
    }

    public static getSuperAdmin() {
        return this.getRoles().find((role) => role.role_name === this.SUPER_ADMIN);
    }

    public static getManagement() {
        return this.getRoles().find((role) => role.role_name === this.MANAGEMENT);
    }

    public static getNormalAdmin() {
        return this.getRoles().find((role) => role.role_name === this.NORMAL_ADMIN);
    }
}
