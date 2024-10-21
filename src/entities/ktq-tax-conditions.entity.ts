import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ConditionType } from "@/common/enums/condition-type.enum";
import { ConditionDataType } from "@/common/enums/condition-data-type.enum";
import { Timestamp } from "@/common/entities/column/timestamp";

import KtqTaxRate from "./ktq-tax-rates.entity";

@Entity("ktq_tax_conditions")
export default class KtqTaxCondition extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  tax_rate_id: number;

  @Column({ type: "enum", enum: ConditionType })
  condition_type: ConditionType;

  @Column({ type: "varchar" })
  condition_table_name: string;

  @Column({ type: "varchar" })
  condition_table_row: string;

  @Column({ type: "varchar" })
  condition_method: string;

  @Column({ type: "varchar" })
  condition_value: string;

  @Column({ type: "enum", enum: ConditionDataType })
  condition_data_type: ConditionDataType;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => KtqTaxRate, (taxRate) => taxRate.taxConditions, {
    cascade: true,
    eager: true,
  })
  taxRate: KtqTaxRate;
}
