import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityManager, In } from 'typeorm';
import { IsExitedInput } from './decorators/has-existed';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class HasExistedValidator implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}

    async validate(value: any, args: ValidationArguments) {
        const { column, tableName, queryOption, each }: IsExitedInput = args.constraints[0];

        let result = null;

        if (!each) {
            result = await this.entityManager
                .getRepository(tableName)
                .createQueryBuilder(tableName)
                .where({ [column]: value, ...(queryOption || {}) })
                .getOne();
        } else {
            const response = await this.entityManager
                .getRepository(tableName)
                .createQueryBuilder(tableName)
                .where({ [column]: In(value), ...(queryOption || {}) })
                .getMany();

            result = response.length === value.length;
        }

        return !!result;
    }

    defaultMessage(args: ValidationArguments) {
        const { column, message }: IsExitedInput = args.constraints[0];

        return message || `${column} $value is not found`;
    }
}
