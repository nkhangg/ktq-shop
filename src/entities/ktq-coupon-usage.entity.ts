import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqCoupon from "./ktq-coupons.entity";
import KtqCustomer from "./ktq-customers.entity";
import KtqOrder from "./ktq-orders.entity";

@Entity("ktq_coupon_usage")
export default class KtqCouponUsage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  coupon_id: number;

  @Column({ type: "integer" })
  user_id: number;

  @Column({ type: "integer" })
  order_id: number;

  @Column({ type: "timestamp", default: null })
  used_at: Date;

  @ManyToOne(() => KtqCoupon, (coupon) => coupon.couponUsages, {
    cascade: true,
    eager: true,
  })
  coupon: KtqCoupon;

  @ManyToOne(() => KtqCustomer, (customer) => customer.couponUsages, {
    cascade: true,
    eager: true,
  })
  customer: KtqCustomer;

  @ManyToOne(() => KtqOrder, (order) => order.couponUsages, {
    cascade: true,
    eager: true,
  })
  order: KtqOrder;
}
