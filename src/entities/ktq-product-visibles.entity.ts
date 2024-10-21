import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqProduct from "./ktq-products.entity";
import KtqVisible from "./ktq-visibles.entity";

@Entity("ktq_product_visibles")
export default class KtqProductVisible {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "integer" })
  visible_id: number;

  @ManyToOne(() => KtqProduct, (product) => product.productVisibles, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;

  @ManyToOne(() => KtqVisible, (visible) => visible.productVisibles, {
    cascade: true,
    eager: true,
  })
  visible: KtqVisible;
}
