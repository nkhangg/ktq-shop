import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqAdminUser from "./ktq-admin-users.entity";
import KtqRolePermission from "./ktq-role-permissions.entity";
import KtqRoleResource from "./ktq-role-resources.entity";

@Entity("ktq_roles")
export default class KtqRole extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  role_name: string;

  @OneToMany(() => KtqAdminUser, (adminUser) => adminUser.role)
  @Exclude()
  adminUsers: KtqAdminUser[];

  @OneToMany(() => KtqRolePermission, (rolePermission) => rolePermission.role)
  @Exclude()
  rolePermissions: KtqRolePermission[];

  @OneToMany(() => KtqRoleResource, (roleResource) => roleResource.role)
  @Exclude()
  roleResources: KtqRoleResource[];
}
