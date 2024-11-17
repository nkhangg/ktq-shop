import { UserRoleType } from '@/common/enums/user-role-type.enum';
import { registerDecorator, ValidationOptions } from 'class-validator';
import { OnBlackListValidator } from '../on-black-list.validator';

export type TOnBlackList = {
    user_role_type: UserRoleType;
    message?: string;
    column?: 'username' | 'email';
};

export function OnBlackList(options: TOnBlackList, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'on-black-list',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: OnBlackListValidator,
        });
    };
}
