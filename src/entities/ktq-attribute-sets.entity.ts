import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProduct from "./ktq-products.entity";
import KtqAttribute from "./ktq-attributes.entity";

@Entity("ktq_attribute_sets")
export default class KtqAttributeSet extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  attribute_set_code: string;

  @Column({ type: "varchar" })
  attribute_id: string;

  @OneToOne(() => KtqProduct, (product) => product.attributeSet)
  product: KtqProduct;

  @OneToMany(() => KtqAttribute, (attribute) => attribute.attributeSet)
  attributes: KtqAttribute[];
}
