import { IsNumber } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

export default class GeneralKtqResourcePermissionDto {
    user_admin_id: number;
    resource_id: number;
    permission_id: number;
}

export class CreateResourcePermission {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_resources', column: 'id' })
    resource_id: KtqResource['id'];

    @IsNumber()
    @HasExisted({ tableName: 'ktq_permissions', column: 'id' })
    permission_id: KtqPermission['id'];

    @IsNumber()
    @HasExisted({ tableName: 'ktq_admin_users', column: 'id' })
    admin_user_id: KtqAdminUser['id'];
}

export class DeleteResourcePermission {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_resources', column: 'id' })
    resource_id: KtqResource['id'];
}
