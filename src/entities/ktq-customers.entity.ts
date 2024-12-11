import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Exclude, Transform } from 'class-transformer';
import { Gender } from '@/common/enums/gender.enum';
import { Timestamp } from '@/common/entities/column/timestamp';

import KtqProductReview from './ktq-product-reviews.entity';
import KtqOrder from './ktq-orders.entity';
import KtqCart from './ktq-carts.entity';
import KtqAddress from './ktq-addresses.entity';
import KtqCouponUsage from './ktq-coupon-usage.entity';
import KtqCustomerGroup from './ktq-customer-groups.entity';
import KtqConfigConstant from '@/constants/ktq-configs.constant';

@Entity('ktq_customers')
export default class KtqCustomer extends Timestamp {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar' })
    username: string;

    @Column({ type: 'varchar' })
    @Exclude()
    password: string;

    @Column({ type: 'varchar', default: null })
    @Transform(({ value }) => {
        if (!value) return value;

        return `${KtqConfigConstant.getCustomerMediaPath(value, 'avatar', true)}`;
    })
    avatar: string;

    @Column({ type: 'varchar', default: null })
    @Transform(({ value }) => {
        if (!value) return value;

        return `${KtqConfigConstant.getCustomerMediaPath(value, 'avatar', true)}`;
    })
    bg_cover: string;

    @Column({ type: 'varchar' })
    email: string;

    @Column({ type: 'varchar', default: null })
    first_name: string;

    @Column({ type: 'varchar', default: null })
    last_name: string;

    @Column({ type: 'varchar', default: null })
    date_of_birth: string;

    @Column({ type: 'boolean', default: 1 })
    is_active: boolean;

    @Column({ type: 'varchar', default: null })
    vat_number: string;

    @Column({ type: 'varchar', default: null })
    phone: string;

    @Column({ type: 'enum', enum: Gender, default: Gender.OTHER })
    gender: Gender;

    @OneToMany(() => KtqProductReview, (productReview) => productReview.customer)
    //@Exclude()
    productReviews: KtqProductReview[];

    @OneToMany(() => KtqOrder, (order) => order.customer)
    //@Exclude()
    orders: KtqOrder[];

    @OneToMany(() => KtqCart, (cart) => cart.customer)
    //@Exclude()
    carts: KtqCart[];

    @OneToMany(() => KtqAddress, (address) => address.customer)
    //@Exclude()
    addresses: KtqAddress[];

    @OneToMany(() => KtqCouponUsage, (couponUsage) => couponUsage.customer)
    //@Exclude()
    couponUsages: KtqCouponUsage[];

    @ManyToOne(() => KtqCustomerGroup, (customerGroup) => customerGroup.customers, { cascade: true, eager: true })
    //@Exclude()
    customerGroup: KtqCustomerGroup;
}
