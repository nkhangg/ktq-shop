import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";

import KtqDistrict from "./ktq-districts.entity";

@Entity("ktq_provinces")
export default class KtqProvince {
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
  phone_code: number;

  @OneToMany(() => KtqDistrict, (district) => district.province)
  @Exclude()
  districts: KtqDistrict[];
}
