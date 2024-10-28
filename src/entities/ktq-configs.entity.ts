import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { KeyType } from "@/common/enums/key-type.enum";

@Entity("ktq_configs")
export default class KtqConfig {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  key_name: string;

  @Column({ type: "enum", enum: KeyType })
  key_type: KeyType;

  @Column({ type: "varchar" })
  key_value: string;
}
