import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
} from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqCustomer from "./ktq-customers.entity";
import KtqCountry from "./ktq-countries.entity";
import KtqRegion from "./ktq-regions.entity";

@Entity("ktq_addresses")
export default class KtqAddress extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  customer_id: number;

  @Column({ type: "varchar" })
  address_line: string;

  @Column({ type: "varchar" })
  ward: string;

  @Column({ type: "varchar" })
  district: string;

  @Column({ type: "varchar" })
  city: string;

  @Column({ type: "varchar" })
  postal_code: string;

  @Column({ type: "varchar" })
  state: string;

  @Column({ type: "integer" })
  country_id: number;

  @Column({ type: "integer" })
  region_id: number;

  @Column({ type: "boolean", default: 0 })
  is_default: boolean;

  @OneToOne(() => KtqOrder, (order) => order.address)
  order: KtqOrder;

  @ManyToOne(() => KtqCustomer, (customer) => customer.addresses, {
    cascade: true,
    eager: true,
  })
  customer: KtqCustomer;

  @ManyToOne(() => KtqCountry, (country) => country.addresses, {
    cascade: true,
    eager: true,
  })
  country: KtqCountry;

  @ManyToOne(() => KtqRegion, (region) => region.addresses, {
    cascade: true,
    eager: true,
  })
  region: KtqRegion;
}
