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

@Entity("ktq_default_attributes")
export default class KtqDefaultAttribute extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  product_type: string;

  @OneToOne(() => KtqProduct, (product) => product.defaultAttribute)
  //@Exclude()
  product: KtqProduct;

  @OneToMany(() => KtqAttribute, (attribute) => attribute.defaultAttribute)
  //@Exclude()
  attributes: KtqAttribute[];
}
