import { ArrayNotEmpty, IsArray, IsBoolean, IsEmail, IsEnum, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqRole from '@/entities/ktq-roles.entity';
import { IsUnique } from '../systems/validators/decorators/is-unique';

export class ConfirmPasswordAdmin {
    @IsString()
    @IsOptional()
    admin_password: string;

    @IsOptional()
    @IsBoolean()
    use_time: boolean;
}

export default interface GeneralKtqAdminUserDto {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}

export class UpdateKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;
}

export class ChangePasswordKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @MinLength(6)
    new_password: string;
}

export class SetNewPasswordKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsString()
    @MinLength(6)
    new_password: string;
}

export class IdsKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    ids: KtqAdminUser['id'][];
}

export class CreateKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsString()
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_admin_users', column: 'username' })
    username: string;

    @IsEmail()
    @IsUnique({ tableName: 'ktq_admin_users', column: 'email' })
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    @IsOptional()
    first_name: string;

    @IsString()
    @IsOptional()
    last_name: string;

    @IsString()
    @IsEnum(Gender)
    @IsOptional()
    gender: Gender;
}

export class UpdateRoleKtqAdminUserDto extends ConfirmPasswordAdmin {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_roles', column: 'id' })
    role_id: KtqRole['id'];
}
