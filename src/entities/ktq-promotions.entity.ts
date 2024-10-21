import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DiscountType } from '@/common/enums/discount-type.enum';
import { PromotionsStatus } from '@/common/enums/promotions-status.enum';
import { Timestamp } from '@/common/entities/column/timestamp';

import KtqProductPromotion from './ktq-product-promotions.entity';

@Entity('ktq_promotions')
export default class KtqPromotion extends Timestamp {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({ type: 'varchar', unique: true })
    promotion_code: string;

    @Column({ type: 'varchar' })
    description: string;

    @Column({ type: 'enum', enum: DiscountType })
    discount_type: DiscountType;

    @Column({ type: 'float', default: null })
    discount_value: number;

    @Column({ type: 'timestamp', default: null })
    start_date: Date;

    @Column({ type: 'timestamp' })
    end_date: Date;

    @Column({ type: 'enum', enum: PromotionsStatus })
    promotions_status: PromotionsStatus;

    @Column({ type: 'json' })
    applicable_product_types: object;

    @Column({ type: 'json', default: null })
    histories: object;

    @Column({ type: 'timestamp' })
    created_at: Date;

    @Column({ type: 'timestamp' })
    updated_at: Date;

    @OneToMany(() => KtqProductPromotion, (productPromotion) => productPromotion.promotion)
    productPromotions: KtqProductPromotion[];
}