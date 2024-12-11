import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { UserRoleType } from "@/common/enums/user-role-type.enum";
import { Timestamp } from "@/common/entities/column/timestamp";

@Entity("ktq_sessions")
export default class KtqSession extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "int" })
  @Exclude()
  user_id: number;

  @Column({ type: "enum", enum: UserRoleType })
  user_role_type: UserRoleType;

  @Column({ type: "varchar" })
  session_token: string;

  @Column({ type: "json", default: null })
  payload: string;

  @Column({ type: "timestamp", default: null })
  expires_at: Date;

  @Column({ type: "bool", default: 1 })
  live: boolean;

  @Column({ type: "varchar" })
  user_agent: string;
}
