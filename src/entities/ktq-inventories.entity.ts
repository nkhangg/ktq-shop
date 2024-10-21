import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

@Entity("ktq_inventories")
export default class KtqInventory extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "json" })
  attribute_values: object;

  @Column({ type: "integer" })
  quantity: number;
}
