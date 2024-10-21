import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ktq_coupon_usage")
export default class KtqCouponUsage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer", default: null })
  coupon_id: number;

  @Column({ type: "integer" })
  user_id: number;

  @Column({ type: "integer" })
  order_id: number;

  @Column({ type: "timestamp" })
  used_at: Date;

  @Column({ type: "timestamp" })
  created_at: Date;
}
