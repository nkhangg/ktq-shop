import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqPaymentMethod from "./ktq-payment-methods.entity";

@Entity("ktq_order_payments")
export default class KtqOrderPayment extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  order_id: number;

  @Column({ type: "integer" })
  payment_method_id: number;

  @Column({ type: "float" })
  amount: number;

  @Column({ type: "varchar" })
  status: string;

  @ManyToOne(() => KtqOrder, (order) => order.orderPayments, {
    cascade: true,
    eager: true,
  })
  order: KtqOrder;

  @ManyToOne(
    () => KtqPaymentMethod,
    (paymentMethod) => paymentMethod.orderPayments,
    { cascade: true, eager: true },
  )
  paymentMethod: KtqPaymentMethod;
}
