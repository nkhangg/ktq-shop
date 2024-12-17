import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';

import KtqAdminUser from './ktq-admin-users.entity';
import KtqResource from './ktq-resources.entity';
import KtqPermission from './ktq-permissions.entity';

@Entity('ktq_resource_permissions')
export default class KtqResourcePermission {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => KtqAdminUser, (adminUser) => adminUser.resourcePermissions, {
        cascade: ['remove'],
        eager: true,
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    adminUser: KtqAdminUser;

    @ManyToOne(() => KtqResource, (resource) => resource.resourcePermissions, {
        cascade: true,
        eager: true,
    })
    //@Exclude()
    resource: KtqResource;

    @ManyToOne(() => KtqPermission, (permission) => permission.resourcePermissions, { cascade: true, eager: true })
    //@Exclude()
    permission: KtqPermission;
}
