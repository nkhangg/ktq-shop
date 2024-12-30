import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

import KtqRole from './ktq-roles.entity';
import KtqPermission from './ktq-permissions.entity';

@Entity('ktq_role_permissions')
@Unique(['role', 'permission'])
export default class KtqRolePermission {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => KtqRole, (role) => role.rolePermissions, {
        eager: true,
        cascade: ['remove'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    role: KtqRole;

    @ManyToOne(() => KtqPermission, (permission) => permission.rolePermissions, {
        eager: true,
        cascade: ['remove'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    permission: KtqPermission;
}
