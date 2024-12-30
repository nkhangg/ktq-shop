import { UserRoleType } from '../enums/user-role-type.enum';
import { BackListType } from '../enums/back-list-type.enum';
import { ArrayNotEmpty, IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Type } from 'class-transformer';
import { IsNull } from 'typeorm';
import { IsAfter } from '../systems/validators/decorators/is-after';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { ConfirmPasswordAdmin } from './ktq-admin-users.dto';

export default class GeneralKtqUserBlackListDto {
    user_id_app: number;
    user_role_type: UserRoleType;
    back_list_type: BackListType;
    start_at?: Date;
    end_at?: Date;
    reason: string;
}

export class BlockKtqCustomersDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ids: KtqCustomer['id'][];

    @Type(() => Date)
    @IsDate()
    @ValidateIf((object, value) => value !== null)
    from: Date | null;

    @Type(() => Date)
    @IsDate()
    @ValidateIf((object, value) => value !== null)
    to: Date | null;
}

export class BlockKtqCustomerDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_customers', column: 'id' })
    customer_id: KtqCustomer['id'];

    @Type(() => Date)
    @IsDate()
    from: Date | null;

    @Type(() => Date)
    @IsDate()
    @ValidateIf((object, value) => value !== null)
    @IsAfter('from', { message: 'The "to" date must be greater than the "from" date.' })
    to: Date | null;

    @IsEnum(BackListType, { message: 'black_list_type must be either "warning" or "block".' })
    black_list_type: BackListType;

    @IsString()
    @IsOptional()
    reason: string | null;
}

export class BlockKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_admin_users', column: 'id' })
    admin_user_id: KtqAdminUser['id'];

    @Type(() => Date)
    @IsDate()
    from: Date | null;

    @Type(() => Date)
    @IsDate()
    @ValidateIf((object, value) => value !== null)
    @IsAfter('from', { message: 'The "to" date must be greater than the "from" date.' })
    to: Date | null;

    @IsEnum(BackListType, { message: 'black_list_type must be either "warning" or "block".' })
    black_list_type: BackListType;

    @IsString()
    @IsOptional()
    reason: string | null;
}

export class UnlockKtqCustomerDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_user_black_lists', column: 'user_id_app', queryOption: { user_role_type: UserRoleType.CUSTOMER } })
    customer_id: KtqCustomer['id'];
}

export class UnlockKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_user_black_lists', column: 'user_id_app', queryOption: { user_role_type: UserRoleType.ADMIN } })
    admin_user_id: KtqAdminUser['id'];
}
