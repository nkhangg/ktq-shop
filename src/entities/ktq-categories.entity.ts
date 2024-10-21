import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCategoryProduct from "./ktq-category-products.entity";

@Entity("ktq_categories")
export default class KtqCategory extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  website_id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "boolean" })
  enable: boolean;

  @Column({ type: "varchar" })
  url_key: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "integer" })
  parent_id: number;

  @OneToMany(
    () => KtqCategoryProduct,
    (categoryProduct) => categoryProduct.category,
  )
  categoryProducts: KtqCategoryProduct[];
}
