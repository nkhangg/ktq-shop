import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqAttribute from "./ktq-attributes.entity";

@Entity("ktq_attribute_values")
export default class KtqAttributeValue extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  attribute_id: number;

  @Column({ type: "varchar" })
  value: string;

  @ManyToOne(() => KtqAttribute, (attribute) => attribute.attributeValues, {
    cascade: true,
    eager: true,
  })
  attribute: KtqAttribute;
}
