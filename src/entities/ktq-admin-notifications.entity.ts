import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
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

  @OneToMany(
    () => KtqReadAdminNotification,
    (readAdminNotification) => readAdminNotification.adminNotification,
  )
  //@Exclude()
  readAdminNotifications: KtqReadAdminNotification[];
}
