import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function IsAfter(property: string, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isAfter',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [property],
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (value == null || relatedValue == null) {
                        return true;
                    }
                    return value > relatedValue;
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `$property must be greater than ${relatedPropertyName}`;
                },
            },
        });
    };
}
