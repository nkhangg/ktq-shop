import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProductReview from "./ktq-product-reviews.entity";
import KtqOrder from "./ktq-orders.entity";
import KtqCart from "./ktq-carts.entity";
import KtqAddress from "./ktq-addresses.entity";
import KtqCouponUsage from "./ktq-coupon-usage.entity";

@Entity("ktq_customers")
export default class KtqCustomer extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar" })
  @Exclude()
  password: string;

  @Column({ type: "varchar" })
  email: string;

  @Column({ type: "varchar", default: null })
  first_name: string;

  @Column({ type: "varchar", default: null })
  last_name: string;

  @OneToMany(() => KtqProductReview, (productReview) => productReview.customer)
  @Exclude()
  productReviews: KtqProductReview[];

  @OneToMany(() => KtqOrder, (order) => order.customer)
  @Exclude()
  orders: KtqOrder[];

  @OneToMany(() => KtqCart, (cart) => cart.customer)
  @Exclude()
  carts: KtqCart[];

  @OneToMany(() => KtqAddress, (address) => address.customer)
  @Exclude()
  addresses: KtqAddress[];

  @OneToMany(() => KtqCouponUsage, (couponUsage) => couponUsage.customer)
  @Exclude()
  couponUsages: KtqCouponUsage[];
}
