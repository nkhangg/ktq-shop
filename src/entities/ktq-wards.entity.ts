import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqDistrict from "./ktq-districts.entity";

@Entity("ktq_wards")
export default class KtqWard {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int" })
  code: number;

  @Column({ type: "varchar" })
  division_type: string;

  @Column({ type: "varchar" })
  codename: string;

  @Column({ type: "int" })
  district_code: number;

  @ManyToOne(() => KtqDistrict, (district) => district.wards, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  district: KtqDistrict;
}
