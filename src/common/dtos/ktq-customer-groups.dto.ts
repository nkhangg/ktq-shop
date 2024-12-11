import { IsString, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export default class GeneralKtqCustomerGroupDto {
    @IsString()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_customer_groups', column: 'name' })
    name: string;
}
