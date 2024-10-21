import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

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

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => KtqAdminUser, (adminUser) => adminUser.role)
  adminUsers: KtqAdminUser[];

  @OneToMany(() => KtqRolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: KtqRolePermission[];

  @OneToMany(() => KtqRoleResource, (roleResource) => roleResource.role)
  roleResources: KtqRoleResource[];
}
