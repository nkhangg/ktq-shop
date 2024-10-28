import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsUniqueValidator } from '../is-unique.validator';

export type IsUniqueInput = {
    tableName: string;
    column: string;
    queryOption?: Record<string, any>;
};

export function IsUnique(options: IsUniqueInput, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'is-unique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueValidator,
        });
    };
}
