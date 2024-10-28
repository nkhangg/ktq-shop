import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { EntityManager } from 'typeorm';
import { IsUniqueInput } from './decorators/is-unique';

@Injectable()
@ValidatorConstraint({ name: 'isUnique', async: true })
export class IsUniqueValidator implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}

    async validate(value: string, args: ValidationArguments) {
        const { column, tableName, queryOption }: IsUniqueInput = args.constraints[0];

        const result = await this.entityManager
            .getRepository(tableName)
            .createQueryBuilder(tableName)
            .where({ [column]: value, ...(queryOption || {}) })
            .getOne();

        return !result;
    }

    defaultMessage(args: ValidationArguments) {
        const { column }: IsUniqueInput = args.constraints[0];

        return `${column} $value already exists`;
    }
}
