import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqAttribute from "./ktq-attributes.entity";

@Entity("ktq_attribute_values")
export default class KtqAttributeValue extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  value: string;

  @ManyToOne(() => KtqAttribute, (attribute) => attribute.attributeValues, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  attribute: KtqAttribute;
}
