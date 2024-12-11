import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import KtqProduct from "./ktq-products.entity";
import KtqWebsite from "./ktq-websites.entity";

@Entity("ktq_product_websites")
export default class KtqProductWebsite {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => KtqProduct, (product) => product.productWebsites, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  product: KtqProduct;

  @ManyToOne(() => KtqWebsite, (website) => website.productWebsites, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  website: KtqWebsite;
}
