import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrderTax from "./ktq-order-taxes.entity";
import KtqTaxCondition from "./ktq-tax-conditions.entity";

@Entity("ktq_tax_rates")
export default class KtqTaxRate extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  rate_name: string;

  @Column({ type: "float" })
  rate: number;

  @OneToMany(() => KtqOrderTax, (orderTax) => orderTax.taxRate)
  //@Exclude()
  orderTaxes: KtqOrderTax[];

  @OneToMany(() => KtqTaxCondition, (taxCondition) => taxCondition.taxRate)
  //@Exclude()
  taxConditions: KtqTaxCondition[];
}
