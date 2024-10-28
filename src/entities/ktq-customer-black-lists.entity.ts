import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";
import { BackListType } from "@/common/enums/back-list-type.enum";

import KtqCustomer from "./ktq-customers.entity";
import KtqCustomerBackListLog from "./ktq-customer-back-list-logs.entity";

@Entity("ktq_customer_black_lists")
export default class KtqCustomerBlackList {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "enum", enum: BackListType })
  back_list_type: BackListType;

  @Column({ type: "timestamp", default: null })
  start_at: Date;

  @Column({ type: "timestamp", default: null })
  end_at: Date;

  @Column({ type: "varchar" })
  description: string;

  @ManyToOne(() => KtqCustomer, (customer) => customer.customerBlackLists, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  customer: KtqCustomer;

  @OneToMany(
    () => KtqCustomerBackListLog,
    (customerBackListLog) => customerBackListLog.customerBlackList,
  )
  @Exclude()
  customerBackListLogs: KtqCustomerBackListLog[];
}
