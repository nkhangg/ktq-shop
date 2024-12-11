import KtqCustomer from '@/entities/ktq-customers.entity';
import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDate, IsEmail, IsEnum, IsIn, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, MinLength } from 'class-validator';
import { Gender } from '../enums/gender.enum';
import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import { IsUnique } from '../systems/validators/decorators/is-unique';

export default class GeneralKtqCustomerDto {
    @MinLength(6)
    @IsOptional()
    password: string;

    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;

    @IsOptional()
    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    vat_number: string;

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsNumber()
    @HasExisted({ tableName: 'ktq_customer_groups', column: 'id' })
    group_id: KtqCustomerGroup['id'];

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date_of_birth: Date | null;
}

export class DeletesKtqCustomerDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ids: KtqCustomer['id'][];
}

export class HiddenKtqCustomerDto {
    @IsArray()
    @IsNumber({}, { each: true })
    @ArrayNotEmpty()
    ids: KtqCustomer['id'][];
}

export class UpdatesKtqCustomerDataDto {
    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date_of_birth: Date | null;
}

export class UpdatesKtqCustomerDto extends UpdatesKtqCustomerDataDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    ids: KtqCustomer['id'][];
}

export class DeleteMediaKtqCustomerDto extends UpdatesKtqCustomerDataDto {
    @IsIn(['bg_cover', 'avatar'], {
        message: 'Attribute must be either "bg_cover" or "avatar"',
    })
    attr: 'bg_cover' | 'avatar';
}

export class CreateKtqCustomerDto {
    @MinLength(4)
    @IsUnique({ tableName: 'ktq_customers', column: 'username' })
    username: string;

    @MinLength(6)
    password: string;

    @IsEmail()
    @IsUnique({ tableName: 'ktq_customers', column: 'email' })
    email: string;

    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;

    @IsOptional()
    @IsPhoneNumber('VN')
    phone: string;

    @IsOptional()
    vat_number: string;

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @IsOptional()
    @IsNumber()
    @HasExisted({ tableName: 'ktq_customer_groups', column: 'id' })
    group_id: KtqCustomerGroup['id'];

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    date_of_birth: Date | null;
}
