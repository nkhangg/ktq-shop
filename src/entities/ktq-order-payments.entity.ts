import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqPaymentMethod from "./ktq-payment-methods.entity";

@Entity("ktq_order_payments")
export default class KtqOrderPayment extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "float" })
  amount: number;

  @Column({ type: "varchar" })
  status: string;

  @ManyToOne(() => KtqOrder, (order) => order.orderPayments, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  order: KtqOrder;

  @ManyToOne(
    () => KtqPaymentMethod,
    (paymentMethod) => paymentMethod.orderPayments,
    { cascade: true, eager: true },
  )
  //@Exclude()
  paymentMethod: KtqPaymentMethod;
}
