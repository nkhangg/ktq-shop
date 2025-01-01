import { IsArray, IsEnum, IsIn, IsJSON, IsNotEmpty, IsNumber, IsOptional, IsString, Validate, ValidateIf } from 'class-validator';
import { KeyType } from '../enums/key-type.enum';
import { KeySpace } from '../enums/key-space.enum';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import KtqConfig from '@/entities/ktq-configs.entity';

export class CreateKtqConfigDto {
    @IsString()
    @IsNotEmpty()
    @IsUnique({ tableName: 'ktq_configs', column: 'key_name' })
    key_name: string;

    @IsString()
    @IsEnum(KeyType)
    key_type: KeyType;

    @IsString()
    @IsEnum(KeySpace)
    key_space: KeySpace;

    @IsString()
    @ValidateIf((dto: CreateKtqConfigDto) => dto.key_type === 'json')
    @Validate(IsJSON)
    key_value: string;
}

export class UpdateKtqConfigDto {
    @IsString()
    @IsEnum(KeyType)
    key_type: KeyType;

    @IsString()
    @IsEnum(KeySpace)
    key_space: KeySpace;

    @IsString()
    @ValidateIf((dto: CreateKtqConfigDto) => dto.key_type === 'json')
    @Validate(IsJSON)
    key_value: string;
}

export class UpdatePublicKtqConfigDto {
    @IsOptional()
    @IsString()
    @IsEnum(KeyType)
    key_type: KeyType;

    @IsOptional()
    @IsString()
    @ValidateIf((dto: CreateKtqConfigDto) => dto.key_type === 'json')
    @Validate(IsJSON)
    key_value: string;
}

export class DeleteKtqConfigDto {
    @IsNotEmpty()
    @IsArray()
    @IsNumber({}, { each: true })
    ids: KtqConfig['id'][];
}
