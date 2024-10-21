import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRolePermission from "./ktq-role-permissions.entity";

@Entity("ktq_permissions")
export default class KtqPermission extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  permission_code: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(
    () => KtqRolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: KtqRolePermission[];
}