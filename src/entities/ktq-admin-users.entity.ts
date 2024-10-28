import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRole from "./ktq-roles.entity";

@Entity("ktq_admin_users")
export default class KtqAdminUser extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  email: string;

  @Column({ type: "varchar", unique: true })
  username: string;

  @Column({ type: "varchar", default: null })
  first_name: string;

  @Column({ type: "varchar", default: null })
  last_name: string;

  @Column({ type: "varchar" })
  @Exclude()
  password_hash: string;

  @Column({ type: "boolean", default: 1 })
  @Exclude()
  is_active: boolean;

  @ManyToOne(() => KtqRole, (role) => role.adminUsers, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  role: KtqRole;
}
