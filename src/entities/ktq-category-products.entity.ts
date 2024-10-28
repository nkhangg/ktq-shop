import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqProduct from "./ktq-products.entity";
import KtqCategory from "./ktq-categories.entity";

@Entity("ktq_category_products")
export default class KtqCategoryProduct {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqProduct, (product) => product.categoryProducts, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;

  @ManyToOne(() => KtqCategory, (category) => category.categoryProducts, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  category: KtqCategory;
}
