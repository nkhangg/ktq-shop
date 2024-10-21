import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqRole from "./ktq-roles.entity";
import KtqResource from "./ktq-resources.entity";

@Entity("ktq_role_resources")
export default class KtqRoleResource {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "int" })
  role_id: number;

  @Column({ type: "int" })
  resource_id: number;

  @ManyToOne(() => KtqRole, (role) => role.roleResources, {
    cascade: true,
    eager: true,
  })
  role: KtqRole;

  @ManyToOne(() => KtqResource, (resource) => resource.roleResources, {
    cascade: true,
    eager: true,
  })
  resource: KtqResource;
}
