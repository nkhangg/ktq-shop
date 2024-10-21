import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { BackListType } from "@/common/enums/back-list-type.enum";

import KtqCustomer from "./ktq-customers.entity";
import KtqCustomerBlackList from "./ktq-customer-black-lists.entity";

@Entity("ktq_customer_back_list_logs")
export default class KtqCustomerBackListLog {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  customer_id: number;

  @Column({ type: "integer" })
  black_list_id: number;

  @Column({ type: "enum", enum: BackListType })
  back_list_type: BackListType;

  @Column({ type: "timestamp", default: null })
  start_at: Date;

  @Column({ type: "timestamp", default: null })
  end_at: Date;

  @Column({ type: "varchar" })
  description: string;

  @ManyToOne(() => KtqCustomer, (customer) => customer.customerBackListLogs, {
    cascade: true,
    eager: true,
  })
  customer: KtqCustomer;

  @ManyToOne(
    () => KtqCustomerBlackList,
    (customerBlackList) => customerBlackList.customerBackListLogs,
    { cascade: true, eager: true },
  )
  customerBlackList: KtqCustomerBlackList;
}
