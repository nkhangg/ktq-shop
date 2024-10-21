import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { ConditionType } from "@/common/enums/condition-type.enum";
import { ConditionDataType } from "@/common/enums/condition-data-type.enum";
import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCoupon from "./ktq-coupons.entity";

@Entity("ktq_coupon_conditions")
export default class KtqCouponCondition extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  coupon_id: number;

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

  @ManyToOne(() => KtqCoupon, (coupon) => coupon.couponConditions, {
    cascade: true,
    eager: true,
  })
  coupon: KtqCoupon;
}
