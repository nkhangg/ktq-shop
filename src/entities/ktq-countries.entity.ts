import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

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

  @OneToMany(() => KtqRegion, (region) => region.country)
  //@Exclude()
  regions: KtqRegion[];

  @OneToMany(() => KtqAddress, (address) => address.country)
  //@Exclude()
  addresses: KtqAddress[];
}
