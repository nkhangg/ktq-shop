import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import { BackListType } from '@/common/enums/back-list-type.enum';

import KtqUserBackListLog from './ktq-user-back-list-logs.entity';

@Entity('ktq_user_black_lists')
@Unique('UQ_KTQ_USER_BLACK_LISTS_USER_ROLE_TYPE_USER_ID_APP', ['user_role_type', 'user_id_app'])
export default class KtqUserBlackList {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'integer' })
    @Exclude()
    user_id_app: number;

    @Column({ type: 'enum', enum: UserRoleType })
    user_role_type: UserRoleType;

    @Column({ type: 'enum', enum: BackListType })
    back_list_type: BackListType;

    @Column({ type: 'timestamp', default: null })
    start_at: Date;

    @Column({ type: 'timestamp', default: null })
    end_at: Date;

    @Column({ type: 'varchar' })
    reason: string;

    @OneToMany(() => KtqUserBackListLog, (userBackListLog) => userBackListLog.userBlackList)
    @Exclude()
    userBackListLogs: KtqUserBackListLog[];
}
