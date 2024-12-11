import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqCoupon from "./ktq-coupons.entity";
import KtqCustomer from "./ktq-customers.entity";
import KtqOrder from "./ktq-orders.entity";

@Entity("ktq_coupon_usage")
export default class KtqCouponUsage {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "timestamp", default: null })
  used_at: Date;

  @ManyToOne(() => KtqCoupon, (coupon) => coupon.couponUsages, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  coupon: KtqCoupon;

  @ManyToOne(() => KtqCustomer, (customer) => customer.couponUsages, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  customer: KtqCustomer;

  @ManyToOne(() => KtqOrder, (order) => order.couponUsages, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  order: KtqOrder;
}
