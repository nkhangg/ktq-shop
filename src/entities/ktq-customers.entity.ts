import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProductReview from "./ktq-product-reviews.entity";
import KtqOrder from "./ktq-orders.entity";
import KtqCustomerBlackList from "./ktq-customer-black-lists.entity";
import KtqCustomerBackListLog from "./ktq-customer-back-list-logs.entity";
import KtqCart from "./ktq-carts.entity";
import KtqAddress from "./ktq-addresses.entity";
import KtqCouponUsage from "./ktq-coupon-usage.entity";

@Entity("ktq_customers")
export default class KtqCustomer extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar" })
  first_name: string;

  @Column({ type: "varchar" })
  last_name: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => KtqProductReview, (productReview) => productReview.customer)
  productReviews: KtqProductReview[];

  @OneToMany(() => KtqOrder, (order) => order.customer)
  orders: KtqOrder[];

  @OneToMany(
    () => KtqCustomerBlackList,
    (customerBlackList) => customerBlackList.customer,
  )
  customerBlackLists: KtqCustomerBlackList[];

  @OneToMany(
    () => KtqCustomerBackListLog,
    (customerBackListLog) => customerBackListLog.customer,
  )
  customerBackListLogs: KtqCustomerBackListLog[];

  @OneToMany(() => KtqCart, (cart) => cart.customer)
  carts: KtqCart[];

  @OneToMany(() => KtqAddress, (address) => address.customer)
  addresses: KtqAddress[];

  @OneToMany(() => KtqCouponUsage, (couponUsage) => couponUsage.customer)
  couponUsages: KtqCouponUsage[];
}
