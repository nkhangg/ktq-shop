import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqOrder from "./ktq-orders.entity";
import KtqProduct from "./ktq-products.entity";

@Entity("ktq_order_items")
export default class KtqOrderItem extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  product_id: number;

  @Column({ type: "integer" })
  order_id: number;

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
  order: KtqOrder;

  @ManyToOne(() => KtqProduct, (product) => product.orderItems, {
    cascade: true,
    eager: true,
  })
  product: KtqProduct;
}
