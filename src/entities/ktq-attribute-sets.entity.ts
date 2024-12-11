import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProduct from "./ktq-products.entity";
import KtqAttribute from "./ktq-attributes.entity";

@Entity("ktq_attribute_sets")
export default class KtqAttributeSet extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  attribute_set_code: string;

  @OneToOne(() => KtqProduct, (product) => product.attributeSet)
  //@Exclude()
  product: KtqProduct;

  @OneToMany(() => KtqAttribute, (attribute) => attribute.attributeSet)
  //@Exclude()
  attributes: KtqAttribute[];
}
