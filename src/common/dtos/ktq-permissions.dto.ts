import KtqPermission from '@/entities/ktq-permissions.entity';
import { IsNumber } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export default class GeneralKtqPermissionDto {
    permission_code: string;
    description: string;
}

export class AddPermissionForRoleData {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_permissions', column: 'id' })
    permission_id: KtqPermission['id'];
}
