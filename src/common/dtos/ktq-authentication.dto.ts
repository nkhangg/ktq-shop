import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export class LoginKtqAdminUserDto {
    @IsNotEmpty()
    @MinLength(4)
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

    @IsEmail()
    @IsUnique({ tableName: 'ktq_admin_users', column: 'email' })
    email: string;

    @IsNumber()
    @HasExisted({ tableName: 'ktq_roles', column: 'id' })
    role_id: number;
}
