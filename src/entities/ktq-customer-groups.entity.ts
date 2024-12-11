import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCustomer from "./ktq-customers.entity";

@Entity("ktq_customer_groups")
export default class KtqCustomerGroup extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @OneToMany(() => KtqCustomer, (customer) => customer.customerGroup)
  //@Exclude()
  customers: KtqCustomer[];
}
