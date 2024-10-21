import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqAdminNotification from "./ktq-admin-notifications.entity";

@Entity("ktq_read_admin_notifications")
export default class KtqReadAdminNotification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  admin_user_id: number;

  @Column({ type: "timestamp" })
  read_at: Date;

  @ManyToOne(
    () => KtqAdminNotification,
    (adminNotification) => adminNotification.readAdminNotifications,
    { cascade: true, eager: true },
  )
  adminNotification: KtqAdminNotification;
}
