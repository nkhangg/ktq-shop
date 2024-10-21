import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqPromotion from "./ktq-promotions.entity";
import KtqProduct from "./ktq-products.entity";

@Entity("ktq_product_promotions")
export default class KtqProductPromotion {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  promotion_id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => KtqPromotion, (promotion) => promotion.productPromotions, {
    cascade: true,
    eager: true,
  })
  promotion: KtqPromotion;

  @ManyToOne(() => KtqProduct, (product) => product.productPromotions, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;
}
