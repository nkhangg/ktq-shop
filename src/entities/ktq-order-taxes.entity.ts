import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqTaxRate from "./ktq-tax-rates.entity";

@Entity("ktq_order_taxes")
export default class KtqOrderTax extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  order_id: number;

  @Column({ type: "integer" })
  tax_rate_id: number;

  @Column({ type: "float" })
  amount: number;

  @ManyToOne(() => KtqOrder, (order) => order.orderTaxes, {
    cascade: true,
    eager: true,
  })
  order: KtqOrder;

  @ManyToOne(() => KtqTaxRate, (taxRate) => taxRate.orderTaxes, {
    cascade: true,
    eager: true,
  })
  taxRate: KtqTaxRate;
}
