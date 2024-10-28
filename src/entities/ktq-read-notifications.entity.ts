import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqNotification from "./ktq-notifications.entity";

@Entity("ktq_read_notifications")
export default class KtqReadNotification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamp" })
  read_at: Date;

  @ManyToOne(
    () => KtqNotification,
    (notification) => notification.readNotifications,
    { cascade: true, eager: true },
  )
  @Exclude()
  notification: KtqNotification;
}
