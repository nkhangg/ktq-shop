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

  @OneToMany(() => KtqRoleResource, (roleResource) => roleResource.resource)
  roleResources: KtqRoleResource[];
}
