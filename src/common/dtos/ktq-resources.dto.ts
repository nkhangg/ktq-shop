import KtqResource from '@/entities/ktq-resources.entity';
import { TypeResource } from '../enums/type-resource.enum';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

export default class GeneralKtqResourceDto {
    resource_name: string;
    type_resource?: TypeResource;
    resource_code: string;
    resource_method?: string;
    description: string;
}

export class DeleteKtqResourceDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })
    resource_ids: KtqResource['id'][];
}
