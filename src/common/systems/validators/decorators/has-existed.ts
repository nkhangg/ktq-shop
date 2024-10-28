import { registerDecorator, ValidationOptions } from 'class-validator';
import { HasExistedValidator } from '../has-existed.validator';

export type IsExitedInput = {
    tableName: string;
    column: string;
    queryOption?: Record<string, any>;
};

export function HasExisted(options: IsExitedInput, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            name: 'is-unique',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: HasExistedValidator,
        });
    };
}
