import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import KtqProductVisible from "./ktq-product-visibles.entity";

@Entity("ktq_visibles")
export default class KtqVisible {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  value: string;

  @OneToMany(
    () => KtqProductVisible,
    (productVisible) => productVisible.visible,
  )
  productVisibles: KtqProductVisible[];
}