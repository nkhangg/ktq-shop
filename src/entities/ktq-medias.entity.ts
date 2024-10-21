import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
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

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "timestamp" })
  created_at: Date;

  @ManyToOne(() => KtqProduct, (product) => product.medias, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;
}
