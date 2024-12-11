import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqProductReview from "./ktq-product-reviews.entity";
import KtqOrderItem from "./ktq-order-items.entity";
import KtqCart from "./ktq-carts.entity";
import KtqAttributeSet from "./ktq-attribute-sets.entity";
import KtqProductWebsite from "./ktq-product-websites.entity";
import KtqProductPromotion from "./ktq-product-promotions.entity";
import KtqMedia from "./ktq-medias.entity";
import KtqProductVisible from "./ktq-product-visibles.entity";
import KtqCategoryProduct from "./ktq-category-products.entity";
import KtqDefaultAttribute from "./ktq-default-attributes.entity";

@Entity("ktq_products")
export default class KtqProduct extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  sku: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "boolean" })
  has_weight: boolean;

  @Column({ type: "boolean" })
  enable: boolean;

  @Column({ type: "varchar" })
  type: string;

  @Column({ type: "varchar" })
  url_key: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "varchar" })
  short_description: string;

  @OneToMany(() => KtqProductReview, (productReview) => productReview.product)
  //@Exclude()
  productReviews: KtqProductReview[];

  @OneToMany(() => KtqOrderItem, (orderItem) => orderItem.product)
  //@Exclude()
  orderItems: KtqOrderItem[];

  @OneToMany(() => KtqCart, (cart) => cart.product)
  //@Exclude()
  carts: KtqCart[];

  @OneToOne(() => KtqAttributeSet, (attributeSet) => attributeSet.product)
  //@Exclude()
  attributeSet: KtqAttributeSet;

  @OneToMany(
    () => KtqProductWebsite,
    (productWebsite) => productWebsite.product,
  )
  //@Exclude()
  productWebsites: KtqProductWebsite[];

  @OneToMany(
    () => KtqProductPromotion,
    (productPromotion) => productPromotion.product,
  )
  //@Exclude()
  productPromotions: KtqProductPromotion[];

  @OneToMany(() => KtqMedia, (media) => media.product)
  //@Exclude()
  medias: KtqMedia[];

  @OneToMany(
    () => KtqProductVisible,
    (productVisible) => productVisible.product,
  )
  //@Exclude()
  productVisibles: KtqProductVisible[];

  @OneToMany(
    () => KtqCategoryProduct,
    (categoryProduct) => categoryProduct.product,
  )
  //@Exclude()
  categoryProducts: KtqCategoryProduct[];

  @OneToOne(
    () => KtqDefaultAttribute,
    (defaultAttribute) => defaultAttribute.product,
  )
  //@Exclude()
  defaultAttribute: KtqDefaultAttribute;
}
