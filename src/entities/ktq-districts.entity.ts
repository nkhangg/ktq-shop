import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Exclude } from "class-transformer";

import KtqProvince from "./ktq-provinces.entity";
import KtqWard from "./ktq-wards.entity";

@Entity("ktq_districts")
export default class KtqDistrict {
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
  province_code: number;

  @ManyToOne(() => KtqProvince, (province) => province.districts, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  province: KtqProvince;

  @OneToMany(() => KtqWard, (ward) => ward.district)
  @Exclude()
  wards: KtqWard[];
}
