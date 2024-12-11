import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Exclude } from "class-transformer";
import { TypeResource } from "@/common/enums/type-resource.enum";
import { Timestamp } from "@/common/entities/column/timestamp";

import KtqRoleResource from "./ktq-role-resources.entity";
import KtqResourcePermission from "./ktq-resource-permissions.entity";

@Entity("ktq_resources")
export default class KtqResource extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", unique: true })
  resource_name: string;

  @Column({ type: "enum", enum: TypeResource, default: TypeResource.API })
  type_resource: TypeResource;

  @Column({ type: "varchar" })
  resource_code: string;

  @Column({ type: "varchar", default: null })
  resource_method: string;

  @Column({ type: "varchar", default: null })
  description: string;

  @OneToMany(() => KtqRoleResource, (roleResource) => roleResource.resource)
  //@Exclude()
  roleResources: KtqRoleResource[];

  @OneToMany(
    () => KtqResourcePermission,
    (resourcePermission) => resourcePermission.resource,
  )
  //@Exclude()
  resourcePermissions: KtqResourcePermission[];
}
