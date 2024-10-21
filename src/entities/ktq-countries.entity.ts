import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRegion from "./ktq-regions.entity";
import KtqAddress from "./ktq-addresses.entity";

@Entity("ktq_countries")
export default class KtqCountry extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  country_name: string;

  @Column({ type: "varchar" })
  country_code: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => KtqRegion, (region) => region.country)
  regions: KtqRegion[];

  @OneToMany(() => KtqAddress, (address) => address.country)
  addresses: KtqAddress[];
}
