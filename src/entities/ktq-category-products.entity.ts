import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqProduct from "./ktq-products.entity";
import KtqCategory from "./ktq-categories.entity";

@Entity("ktq_category_products")
export default class KtqCategoryProduct {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "integer" })
  category_id: number;

  @ManyToOne(() => KtqProduct, (product) => product.categoryProducts, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;

  @ManyToOne(() => KtqCategory, (category) => category.categoryProducts, {
    cascade: true,
    eager: true,
  })
  category: KtqCategory;
}
