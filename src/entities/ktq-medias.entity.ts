import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { MediaType } from "@/common/enums/media-type.enum";

import KtqProduct from "./ktq-products.entity";

@Entity("ktq_medias")
export default class KtqMedia {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  url: string;

  @Column({ type: "enum", enum: MediaType })
  media_type: MediaType;

  @ManyToOne(() => KtqProduct, (product) => product.medias, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;
}
