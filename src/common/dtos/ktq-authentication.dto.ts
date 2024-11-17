import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import { OnBlackList } from '../systems/validators/decorators/on-black-list';
import { UserRoleType } from '../enums/user-role-type.enum';

export class LoginKtqAdminUserDto {
    @IsNotEmpty()
    @MinLength(4)
    @OnBlackList({ user_role_type: UserRoleType.ADMIN })
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class LoginKtqCustomerDto {
    @IsNotEmpty()
    @MinLength(4)
    @OnBlackList({ user_role_type: UserRoleType.CUSTOMER })
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;
}

export class RegisterKtqAdminUserDto {
    @IsNotEmpty()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_admin_users', column: 'username' })
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsNotEmpty()
    @IsEmail()
    @IsUnique({ tableName: 'ktq_admin_users', column: 'email' })
    email: string;

    @IsNotEmpty()
    @IsNumber()
    @HasExisted({ tableName: 'ktq_roles', column: 'id' })
    role_id: number;
}

export class RegisterKtqCustomerDto {
    @IsNotEmpty()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_customers', column: 'username' })
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEmail()
    @IsUnique({ tableName: 'ktq_customers', column: 'email' })
    email: string;
}

export class RefreshTokenDto {
    @IsNotEmpty()
    refresh_token: string;
}

export class AdminForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @HasExisted({ tableName: 'ktq_admin_users', column: 'email' })
    @OnBlackList({ user_role_type: UserRoleType.ADMIN, column: 'email' })
    email: string;
}

export class CustomerForgotPasswordDto {
    @IsNotEmpty()
    @IsEmail()
    @HasExisted({ tableName: 'ktq_customers', column: 'email' })
    @OnBlackList({ user_role_type: UserRoleType.CUSTOMER, column: 'email' })
    email: string;
}

export class ChangePasswordForgot {
    @IsNotEmpty()
    @HasExisted({ tableName: 'ktq_user_forgot_passwords', column: 'code', queryOption: { forgotten: false }, message: 'The link has expired' })
    code: string;

    @IsNotEmpty()
    @MinLength(6)
    new_password: string;
}
