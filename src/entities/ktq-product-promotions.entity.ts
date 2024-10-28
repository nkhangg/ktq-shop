import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqPromotion from "./ktq-promotions.entity";
import KtqProduct from "./ktq-products.entity";

@Entity("ktq_product_promotions")
export default class KtqProductPromotion {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqPromotion, (promotion) => promotion.productPromotions, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  promotion: KtqPromotion;

  @ManyToOne(() => KtqProduct, (product) => product.productPromotions, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;
}
