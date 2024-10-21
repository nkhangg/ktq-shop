import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRole from "./ktq-roles.entity";

@Entity("ktq_admin_users")
export default class KtqAdminUser extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar" })
  password_hash: string;

  @Column({ type: "int" })
  role_id: number;

  @Column({ type: "boolean", default: 1 })
  is_active: boolean;

  @ManyToOne(() => KtqRole, (role) => role.adminUsers, {
    cascade: true,
    eager: true,
  })
  role: KtqRole;
}
