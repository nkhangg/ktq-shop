import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

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

  @OneToMany(
    () => KtqReadNotification,
    (readNotification) => readNotification.notification,
  )
  //@Exclude()
  readNotifications: KtqReadNotification[];

  @OneToMany(() => KtqNotifiImage, (notifiImage) => notifiImage.notification)
  //@Exclude()
  notifiImages: KtqNotifiImage[];
}
