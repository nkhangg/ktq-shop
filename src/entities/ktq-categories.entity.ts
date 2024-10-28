import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCategoryProduct from "./ktq-category-products.entity";

@Entity("ktq_categories")
export default class KtqCategory extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "boolean" })
  enable: boolean;

  @Column({ type: "varchar" })
  url_key: string;

  @Column({ type: "varchar" })
  description: string;

  @OneToMany(
    () => KtqCategoryProduct,
    (categoryProduct) => categoryProduct.category,
  )
  @Exclude()
  categoryProducts: KtqCategoryProduct[];
}
