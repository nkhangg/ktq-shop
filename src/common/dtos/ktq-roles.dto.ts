import { IsString, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';

export default class GeneralKtqRoleDto {
    @IsString()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_roles', column: 'role_name' })
    role_name: string;
}
