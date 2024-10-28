import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqProduct from "./ktq-products.entity";

@Entity("ktq_order_items")
export default class KtqOrderItem extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar" })
  sku: string;

  @Column({ type: "integer" })
  qty: number;

  @Column({ type: "float" })
  price: number;

  @ManyToOne(() => KtqOrder, (order) => order.orderItems, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  order: KtqOrder;

  @ManyToOne(() => KtqProduct, (product) => product.orderItems, {
    cascade: true,
    eager: true,
  })
  @Exclude()
  product: KtqProduct;
}
