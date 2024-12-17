import { IsNumber, IsString, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqResource from '@/entities/ktq-resources.entity';

export default class GeneralKtqRoleDto {
    @IsString()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_roles', column: 'role_name' })
    role_name: string;
}

export class GetByAdminUserKtqRoleDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_admin_users', column: 'id' })
    admin_user_id: KtqAdminUser['id'];
}

export class AddResourceForRoleKtqRoleDto {
    @IsNumber({}, { each: true })
    @HasExisted({ tableName: 'ktq_resources', column: 'id', each: true })
    resource_ids: KtqResource['id'][];

    @IsNumber({}, { each: true })
    @HasExisted({ tableName: 'ktq_permissions', column: 'id', each: true })
    permission_ids: KtqResource['id'][];
}
