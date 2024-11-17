import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { UserRoleType } from "@/common/enums/user-role-type.enum";

@Entity("ktq_user_forgot_passwords")
export default class KtqUserForgotPassword {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "enum", enum: UserRoleType })
  user_role_type: UserRoleType;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "timestamp", default: null })
  send_at: Date;

  @Column({ type: "varchar" })
  code: string;

  @Column({ type: "boolean", default: 0 })
  forgotten: boolean;

  @Column({ type: "timestamp", default: null })
  time_expired: Date;
}
