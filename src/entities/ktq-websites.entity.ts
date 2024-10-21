import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProductWebsite from "./ktq-product-websites.entity";

@Entity("ktq_websites")
export default class KtqWebsite extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  website_name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(
    () => KtqProductWebsite,
    (productWebsite) => productWebsite.website,
  )
  productWebsites: KtqProductWebsite[];
}
