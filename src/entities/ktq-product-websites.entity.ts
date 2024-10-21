import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import KtqProduct from "./ktq-products.entity";
import KtqWebsite from "./ktq-websites.entity";

@Entity("ktq_product_websites")
export default class KtqProductWebsite {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "integer" })
  website_id: number;

  @ManyToOne(() => KtqProduct, (product) => product.productWebsites, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;

  @ManyToOne(() => KtqWebsite, (website) => website.productWebsites, {
    cascade: true,
    eager: true,
  })
  website: KtqWebsite;
}
