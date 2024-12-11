import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCustomer from "./ktq-customers.entity";
import KtqOrderPayment from "./ktq-order-payments.entity";
import KtqOrderTax from "./ktq-order-taxes.entity";
import KtqAddress from "./ktq-addresses.entity";
import KtqOrderItem from "./ktq-order-items.entity";
import KtqCouponUsage from "./ktq-coupon-usage.entity";

@Entity("ktq_orders")
export default class KtqOrder extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "float" })
  total_amount: number;

  @Column({ type: "float" })
  shipping_cost: number;

  @Column({ type: "float" })
  tax_amount: number;

  @Column({ type: "varchar" })
  status: string;

  @Column({ type: "json" })
  histories: string;

  @ManyToOne(() => KtqCustomer, (customer) => customer.orders, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  customer: KtqCustomer;

  @OneToMany(() => KtqOrderPayment, (orderPayment) => orderPayment.order)
  //@Exclude()
  orderPayments: KtqOrderPayment[];

  @OneToMany(() => KtqOrderTax, (orderTax) => orderTax.order)
  //@Exclude()
  orderTaxes: KtqOrderTax[];

  @OneToOne(() => KtqAddress, (address) => address.order)
  //@Exclude()
  address: KtqAddress;

  @OneToMany(() => KtqOrderItem, (orderItem) => orderItem.order)
  //@Exclude()
  orderItems: KtqOrderItem[];

  @OneToMany(() => KtqCouponUsage, (couponUsage) => couponUsage.order)
  //@Exclude()
  couponUsages: KtqCouponUsage[];
}
