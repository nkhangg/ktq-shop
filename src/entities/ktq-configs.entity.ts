import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("ktq_configs")
export default class KtqConfig {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  key_name: string;

  @Column({ type: "varchar" })
  key_type: string;

  @Column({ type: "varchar" })
  key_value: string;
}
