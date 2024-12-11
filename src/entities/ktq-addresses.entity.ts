import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqCustomer from "./ktq-customers.entity";
import KtqCountry from "./ktq-countries.entity";
import KtqRegion from "./ktq-regions.entity";

@Entity("ktq_addresses")
export default class KtqAddress extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  address_line: string;

  @Column({ type: "varchar" })
  ward: string;

  @Column({ type: "varchar" })
  district: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar", default: null })
  postal_code: string;

  @Column({ type: "varchar", default: null })
  state: string;

  @Column({ type: "boolean", default: 0 })
  is_default: boolean;

  @OneToOne(() => KtqOrder, (order) => order.address)
  //@Exclude()
  order: KtqOrder;

  @ManyToOne(() => KtqCustomer, (customer) => customer.addresses, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  customer: KtqCustomer;

  @ManyToOne(() => KtqCountry, (country) => country.addresses, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  country: KtqCountry;

  @ManyToOne(() => KtqRegion, (region) => region.addresses, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  region: KtqRegion;
}
