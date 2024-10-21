import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import KtqReadNotification from "./ktq-read-notifications.entity";
import KtqNotifiImage from "./ktq-notifi-images.entity";

@Entity("ktq_notifications")
export default class KtqNotification {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  title: string;

  @Column({ type: "varchar" })
  message: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @OneToMany(
    () => KtqReadNotification,
    (readNotification) => readNotification.notification,
  )
  readNotifications: KtqReadNotification[];

  @OneToMany(() => KtqNotifiImage, (notifiImage) => notifiImage.notification)
  notifiImages: KtqNotifiImage[];
}
