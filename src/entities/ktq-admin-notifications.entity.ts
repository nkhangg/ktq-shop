import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { NotificationSeverity } from "@/common/enums/notification-severity.enum";

import KtqReadAdminNotification from "./ktq-read-admin-notifications.entity";

@Entity("ktq_admin_notifications")
export default class KtqAdminNotification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  message: string;

  @Column({ type: "enum", enum: NotificationSeverity })
  notification_severity: NotificationSeverity;

  @Column({ type: "timestamp" })
  created_at: Date;

  @OneToMany(
    () => KtqReadAdminNotification,
    (readAdminNotification) => readAdminNotification.adminNotification,
  )
  readAdminNotifications: KtqReadAdminNotification[];
}
