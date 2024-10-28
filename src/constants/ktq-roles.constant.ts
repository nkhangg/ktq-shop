import KtqRole from '@/entities/ktq-roles.entity';

export default class KtqRolesConstant {
    public static SUPER_ADMIN = 'Super admin';
    public static MANAGEMENT = 'Management';
    public static NORMAL_ADMIN = 'Normal admin';

    public static getRoles() {
        return [
            {
                id: 1,
                role_name: this.SUPER_ADMIN,
            },
            {
                id: 2,
                role_name: this.MANAGEMENT,
            },
            {
                id: 3,
                role_name: this.NORMAL_ADMIN,
            },
        ] as KtqRole[];
    }
}
