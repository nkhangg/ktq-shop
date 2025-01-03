import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

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

  @OneToMany(
    () => KtqProductWebsite,
    (productWebsite) => productWebsite.website,
  )
  //@Exclude()
  productWebsites: KtqProductWebsite[];
}
