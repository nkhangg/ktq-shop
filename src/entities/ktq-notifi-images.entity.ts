import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqNotification from "./ktq-notifications.entity";

@Entity("ktq_notifi_images")
export default class KtqNotifiImage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  noti_id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  url: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(
    () => KtqNotification,
    (notification) => notification.notifiImages,
    { cascade: true, eager: true },
  )
  notification: KtqNotification;
}
