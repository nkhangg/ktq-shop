import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

@Entity("ktq_inventories")
export default class KtqInventory extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  @Exclude()
  product_id: number;

  @Column({ type: "json" })
  attribute_values: string;

  @Column({ type: "integer" })
  quantity: number;
}
