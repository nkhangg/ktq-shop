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

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => KtqAttribute, (attribute) => attribute.attributeValues, {
    cascade: true,
    eager: true,
  })
  attribute: KtqAttribute;
}
