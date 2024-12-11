import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqRole from "./ktq-roles.entity";
import KtqResource from "./ktq-resources.entity";

@Entity("ktq_role_resources")
export default class KtqRoleResource {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqRole, (role) => role.roleResources, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  role: KtqRole;

  @ManyToOne(() => KtqResource, (resource) => resource.roleResources, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  resource: KtqResource;
}
