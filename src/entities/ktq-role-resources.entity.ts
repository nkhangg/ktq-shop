import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

import KtqRole from './ktq-roles.entity';
import KtqResource from './ktq-resources.entity';

@Entity('ktq_role_resources')
@Unique(['role', 'resource'])
export default class KtqRoleResource {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => KtqRole, (role) => role.roleResources, {
        eager: true,
        cascade: ['remove'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    role: KtqRole;

    @ManyToOne(() => KtqResource, (resource) => resource.roleResources, {
        eager: true,
        cascade: ['remove'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    //@Exclude()
    resource: KtqResource;
}
