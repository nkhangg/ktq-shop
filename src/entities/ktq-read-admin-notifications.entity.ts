import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqAdminNotification from "./ktq-admin-notifications.entity";

@Entity("ktq_read_admin_notifications")
export default class KtqReadAdminNotification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamp" })
  read_at: Date;

  @ManyToOne(
    () => KtqAdminNotification,
    (adminNotification) => adminNotification.readAdminNotifications,
    { cascade: true, eager: true },
  )
  //@Exclude()
  adminNotification: KtqAdminNotification;
}
