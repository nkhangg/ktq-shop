import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

import { KeyType } from "@/common/enums/key-type.enum";
import { KeySpace } from "@/common/enums/key-space.enum";

@Entity("ktq_configs")
export default class KtqConfig {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  key_name: string;

  @Column({ type: "enum", enum: KeyType })
  key_type: KeyType;

  @Column({ type: "enum", enum: KeySpace, default: KeySpace.PRIVATE })
  key_space: KeySpace;

  @Column({ type: "varchar" })
  key_value: string;
}
