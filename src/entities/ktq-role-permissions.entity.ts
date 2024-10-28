import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqRole from "./ktq-roles.entity";
import KtqPermission from "./ktq-permissions.entity";

@Entity("ktq_role_permissions")
export default class KtqRolePermission {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqRole, (role) => role.rolePermissions, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  role: KtqRole;

  @ManyToOne(() => KtqPermission, (permission) => permission.rolePermissions, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  permission: KtqPermission;
}
