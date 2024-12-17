import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { Timestamp } from '@/common/entities/column/timestamp';

import KtqRole from './ktq-roles.entity';
import KtqResourcePermission from './ktq-resource-permissions.entity';
import { Gender } from '@/common/enums/gender.enum';

@Entity('ktq_admin_users')
export default class KtqAdminUser extends Timestamp {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', unique: true })
    email: string;

    @Column({ type: 'varchar', unique: true })
    username: string;

    @Column({ type: 'varchar', default: null })
    first_name: string;

    @Column({ type: 'varchar', default: null })
    last_name: string;

    @Column({ type: 'varchar' })
    @Exclude()
    password_hash: string;

    @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
    gender: Gender;

    @Column({ type: 'boolean', default: 1 })
    is_active: boolean;

    @ManyToOne(() => KtqRole, (role) => role.adminUsers, {
        eager: true,
        cascade: ['remove'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    role: KtqRole;

    @OneToMany(() => KtqResourcePermission, (resourcePermission) => resourcePermission.adminUser)
    //@Exclude()
    resourcePermissions: KtqResourcePermission[];
}
