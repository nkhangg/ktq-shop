import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqProduct from "./ktq-products.entity";
import KtqVisible from "./ktq-visibles.entity";

@Entity("ktq_product_visibles")
export default class KtqProductVisible {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqProduct, (product) => product.productVisibles, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;

  @ManyToOne(() => KtqVisible, (visible) => visible.productVisibles, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  visible: KtqVisible;
}
