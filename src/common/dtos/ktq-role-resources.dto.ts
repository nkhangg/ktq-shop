import { IsNotEmpty } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

export default class GeneralKtqRoleResourceDto {
    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_roles', column: 'id' })
    role_id: number;

    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_resources', column: 'id' })
    resource_id: number;
}

export class GrantPermission {
    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_roles', column: 'id' })
    role_id: number;

    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_resources', column: 'id' })
    resource_id: number;

    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_admin_users', column: 'id', queryOption: { is_active: true } })
    admin_id: KtqAdminUser['id'];
}
