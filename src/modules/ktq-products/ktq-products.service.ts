import GeneralKtqProductDto from '@/common/dtos/ktq-products.dto';
import KtqProduct from '@/entities/ktq-products.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KtqProductsService implements ServiceInterface<KtqProduct, GeneralKtqProductDto> {
    constructor(
        @InjectRepository(KtqProduct)
        private readonly ktqProductRepository: Repository<KtqProduct>,
    ) {}

    async create(product: GeneralKtqProductDto): Promise<KtqProduct> {
        const ktqProduct = this.ktqProductRepository.create(product);
        return this.ktqProductRepository.save(ktqProduct);
    }

    async findAll(): Promise<KtqProduct[]> {
        return this.ktqProductRepository.find();
    }

    async findOne(id: KtqProduct['id']): Promise<KtqProduct> {
        return this.ktqProductRepository.findOneBy({ id });
    }

    async update(id: KtqProduct['id'], product: GeneralKtqProductDto): Promise<KtqProduct> {
        await this.ktqProductRepository.update(id, product);
        return this.findOne(id);
    }

    async delete(id: KtqProduct['id']): Promise<void> {
        await this.ktqProductRepository.delete(id);
    }
}
