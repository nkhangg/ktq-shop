import KtqAddress from '@/entities/ktq-addresses.entity';
import KtqCountry from '@/entities/ktq-countries.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqProvince from '@/entities/ktq-provinces.entity';
import { IsArray, isNumber, IsNumber, IsOptional, IsString } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export default class GeneralKtqAddressDto {
    customer_id: number;
    address_line: string;
    ward: string;
    district: string;
    city: string;
    postal_code: string;
    state: string;
    country_id: number;
    region_id: number;
    is_default?: boolean;
}

export class SetDefaultKtqAddressDto {
    @IsNumber()
    customer_id: KtqCustomer['id'];

    @IsNumber()
    address_id: KtqAddress['id'];
}

export class DeleteKtqAddressDto {
    @IsNumber()
    customer_id: KtqCustomer['id'];

    @IsNumber()
    address_id: KtqAddress['id'];
}

export class DeletesKtqAddressDto {
    @IsNumber({}, { each: true })
    @IsArray()
    address_ids: KtqCustomer['id'][];

    @IsNumber()
    customer_id: KtqCustomer['id'];
}

export class CreateKtqAddressDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_customers', column: 'id' })
    customer_id: KtqCustomer['id'];

    @IsNumber()
    country_id: KtqCountry['id'];

    @IsString()
    province: string;

    @IsString()
    district: string;

    @IsString()
    ward: string;

    @IsString()
    address_line: string;

    @IsString()
    postal_code: string;
}

export class UpdateKtqAddressDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_customers', column: 'id' })
    customer_id: KtqCustomer['id'];

    @IsNumber()
    @HasExisted({ tableName: 'ktq_addresses', column: 'id' })
    address_id: KtqAddress['id'];

    @IsNumber()
    country_id: KtqCountry['id'];

    @IsString()
    province: string;

    @IsString()
    district: string;

    @IsString()
    ward: string;

    @IsString()
    address_line: string;

    @IsString()
    postal_code: string;
}
