import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityManager } from 'typeorm';
import { IsExitedInput } from './decorators/has-existed';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class HasExistedValidator implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}

    async validate(value: string, args: ValidationArguments) {
        const { column, tableName, queryOption }: IsExitedInput = args.constraints[0];

        const result = await this.entityManager
            .getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({ [column]: value, ...(queryOption || {}) })
            .getOne();

        return !!result;
    }

    defaultMessage(args: ValidationArguments) {
        const { column }: IsExitedInput = args.constraints[0];

        return `${column} $value is not found`;
    }
}
