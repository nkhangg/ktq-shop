import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProduct from "./ktq-products.entity";
import KtqCustomer from "./ktq-customers.entity";

@Entity("ktq_product_reviews")
export default class KtqProductReview extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  rating: number;

  @Column({ type: "text" })
  review_text: string;

  @ManyToOne(() => KtqProduct, (product) => product.productReviews, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;

  @ManyToOne(() => KtqCustomer, (customer) => customer.productReviews, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  customer: KtqCustomer;
}
