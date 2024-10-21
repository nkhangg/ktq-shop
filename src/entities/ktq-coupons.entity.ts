import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DiscountType } from '@/common/enums/discount-type.enum';
import { Timestamp } from '@/common/entities/column/timestamp';

import KtqCouponUsage from './ktq-coupon-usage.entity';
import KtqCouponCondition from './ktq-coupon-conditions.entity';

@Entity('ktq_coupons')
export default class KtqCoupon extends Timestamp {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', unique: true })
    code: string;

    @Column({ type: 'enum', enum: DiscountType })
    discount_type: DiscountType;

    @Column({ type: 'float' })
    discount_value: number;

    @Column({ type: 'timestamp', default: null })
    start_date: Date;

    @Column({ type: 'timestamp', default: null })
    end_date: Date;

    @Column({ type: 'integer' })
    usage_limit: number;

    @Column({ type: 'integer', default: 0 })
    usage_count: number;

    @Column({ type: 'json', default: null })
    histories: object;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @OneToMany(() => KtqCouponUsage, (couponUsage) => couponUsage.coupon)
    couponUsages: KtqCouponUsage[];

    @OneToMany(() => KtqCouponCondition, (couponCondition) => couponCondition.coupon)
    couponConditions: KtqCouponCondition[];
}