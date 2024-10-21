import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqRole from "./ktq-roles.entity";
import KtqPermission from "./ktq-permissions.entity";

@Entity("ktq_role_permissions")
export default class KtqRolePermission {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "int" })
  role_id: number;

  @Column({ type: "int" })
  permission_id: number;

  @ManyToOne(() => KtqRole, (role) => role.rolePermissions, {
    cascade: true,
    eager: true,
  })
  role: KtqRole;

  @ManyToOne(() => KtqPermission, (permission) => permission.rolePermissions, {
    cascade: true,
    eager: true,
  })
  permission: KtqPermission;
}
