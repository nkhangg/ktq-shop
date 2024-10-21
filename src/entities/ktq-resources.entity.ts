import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRoleResource from "./ktq-role-resources.entity";

@Entity("ktq_resources")
export default class KtqResource extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  resource_name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "timestamp" })
  created_at: Date;

  @Column({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => KtqRoleResource, (roleResource) => roleResource.resource)
  roleResources: KtqRoleResource[];
}
