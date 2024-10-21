import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrderPayment from "./ktq-order-payments.entity";

@Entity("ktq_payment_methods")
export default class KtqPaymentMethod extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  method_name: string;

  @Column({ type: "varchar" })
  description: string;

  @OneToMany(
    () => KtqOrderPayment,
    (orderPayment) => orderPayment.paymentMethod,
  )
  orderPayments: KtqOrderPayment[];
}
