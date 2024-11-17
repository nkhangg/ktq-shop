import KtqCustomer from '@/entities/ktq-customers.entity';
import { IsArray, IsEmail, IsNumber, IsOptional, MinLength } from 'class-validator';

export default class GeneralKtqCustomerDto {
    @MinLength(6)
    @IsOptional()
    password: string;

    @IsOptional()
    first_name: string;

    @IsOptional()
    last_name: string;
}

export class DeletesKtqCustomerDto {
    @IsArray()
    @IsNumber({}, { each: true })
    ids: KtqCustomer['id'][];
}
