import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserRoleType } from "@/common/enums/user-role-type.enum";
import { Timestamp } from "@/common/entities/column/timestamp";

@Entity("ktq_sessions")
export default class KtqSession extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "enum", enum: UserRoleType })
  user_role_type: UserRoleType;

  @Column({ type: "varchar" })
  session_token: string;

  @Column({ type: "timestamp" })
  expires_at: Date;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;
}
