
            import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany } from 'typeorm';
            
            import { Timestamp } from '@/common/entities/column/timestamp';

            import KtqProduct from "./ktq-products.entity";import KtqAttribute from "./ktq-attributes.entity";


            @Entity('ktq_default_attributes')
            export default class KtqDefaultAttribute extends Timestamp {
                
        @PrimaryGeneratedColumn('increment')
        id: number;
        
            @Column({"type":"varchar"})
            product_type: string;
        
            @Column({"type":"integer"})
            attribute_id: number;
        

                
        
                
                @OneToOne(() => KtqProduct, (product) => product.defaultAttribute, )
                product: KtqProduct;
                
                @OneToMany(() => KtqAttribute, (attribute) => attribute.defaultAttribute)
                attributes: KtqAttribute[];
                
        }