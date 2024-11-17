import { BackListType } from '@/common/enums/back-list-type.enum';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';
import { formatUTCTime } from '@/utils/app';
import { Injectable } from '@nestjs/common';
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Brackets, EntityManager } from 'typeorm';
import { TOnBlackList } from './decorators/on-black-list';

@Injectable()
@ValidatorConstraint({ name: 'onBlackList', async: true })
export class OnBlackListValidator implements ValidatorConstraintInterface {
    constructor(private readonly entityManager: EntityManager) {}

    private table_name = 'ktq_user_black_lists';

    private black_list: KtqUserBlackList | null = null;

    private user;

    async validate(value: string, args: ValidationArguments) {
        const { user_role_type, column }: TOnBlackList = args.constraints[0];

        const user_table = user_role_type === UserRoleType.ADMIN ? 'ktq_admin_users' : 'ktq_customers';

        const user = await this.entityManager
            .getRepository(user_table)
            .createQueryBuilder(user_table)
            .where({ [column ?? 'username']: value, is_active: true })
            .getOne();

        if (!user || !user?.id) {
            this.user = user;
            return false;
        }

        const result: KtqUserBlackList | null = (await this.entityManager
            .getRepository(this.table_name)
            .createQueryBuilder(this.table_name)
            .where({ user_id_app: user.id, back_list_type: BackListType.BLOCK })
            .andWhere(`${this.table_name}.start_at <= CURRENT_TIMESTAMP`)
            .andWhere(
                new Brackets((qb) => {
                    qb.where(`${this.table_name}.end_at >= CURRENT_TIMESTAMP`).orWhere(`${this.table_name}.end_at IS NULL`);
                }),
            )
            .getOne()) as KtqUserBlackList;

        this.black_list = result || null;

        return !result;
    }

    defaultMessage(args: ValidationArguments) {
        const { message }: TOnBlackList = args.constraints[0];

        let mess = '';

        if (!this.user) return 'The user not found';

        if (!this.black_list) return message || `This account is blocking`;

        if (this.black_list.end_at) {
            mess = `This account is blocking form ${formatUTCTime(this.black_list.start_at)} to ${formatUTCTime(this.black_list.end_at)}`;
        } else {
            mess = `The account has been permanently locked`;
        }

        return message || mess;
    }
}
