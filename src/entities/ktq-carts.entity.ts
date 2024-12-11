import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";

import { Timestamp } from "@/common/entities/column/timestamp";

import KtqCustomer from "./ktq-customers.entity";
import KtqProduct from "./ktq-products.entity";

@Entity("ktq_carts")
export default class KtqCart extends Timestamp {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "integer" })
  qty: number;

  @Column({ type: "float" })
  price: number;

  @ManyToOne(() => KtqCustomer, (customer) => customer.carts, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  customer: KtqCustomer;

  @ManyToOne(() => KtqProduct, (product) => product.carts, {
    cascade: true,
    eager: true,
  })
  //@Exclude()
  product: KtqProduct;
}
