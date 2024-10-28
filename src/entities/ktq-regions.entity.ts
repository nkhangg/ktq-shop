import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCountry from "./ktq-countries.entity";
import KtqAddress from "./ktq-addresses.entity";

@Entity("ktq_regions")
export default class KtqRegion extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  region_name: string;

  @Column({ type: "varchar" })
  region_code: string;

  @ManyToOne(() => KtqCountry, (country) => country.regions, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  country: KtqCountry;

  @OneToMany(() => KtqAddress, (address) => address.region)
  @Exclude()
  addresses: KtqAddress[];
}
