import { IsNumber, IsOptional, IsString } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqCountry from '@/entities/ktq-countries.entity';
import KtqProvince from '@/entities/ktq-provinces.entity';

export class AutocompleteKtqAddressDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_countries', column: 'id' })
    country_id: KtqCountry['id'];

    @IsNumber()
    @HasExisted({ tableName: 'ktq_provinces', column: 'id' })
    province_id: KtqProvince['id'];

    @IsString()
    @IsOptional()
    address_line?: string;

    @IsString()
    @IsOptional()
    ward_name?: string;

    @IsString()
    @IsOptional()
    district_name?: string;

    @IsString()
    @IsOptional()
    postal_code?: string;
}
