import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqAttributeSet from "./ktq-attribute-sets.entity";
import KtqAttributeValue from "./ktq-attribute-values.entity";
import KtqDefaultAttribute from "./ktq-default-attributes.entity";

@Entity("ktq_attributes")
export default class KtqAttribute extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  attribute_code: string;

  @Column({ type: "varchar", length: 255 })
  attribute_label: string;

  @Column({ type: "varchar", length: 255 })
  backend_type: string;

  @Column({ type: "varchar", length: 255 })
  frontend_input: string;

  @Column({ type: "boolean" })
  is_required: boolean;

  @Column({ type: "boolean" })
  is_unique: boolean;

  @Column({ type: "boolean" })
  is_system: boolean;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @ManyToOne(() => KtqAttributeSet, (attributeSet) => attributeSet.attributes, {
    cascade: true,
    eager: true,
  })
  attributeSet: KtqAttributeSet;

  @OneToMany(
    () => KtqAttributeValue,
    (attributeValue) => attributeValue.attribute,
  )
  attributeValues: KtqAttributeValue[];

  @ManyToOne(
    () => KtqDefaultAttribute,
    (defaultAttribute) => defaultAttribute.attributes,
    { cascade: true, eager: true },
  )
  defaultAttribute: KtqDefaultAttribute;
}
