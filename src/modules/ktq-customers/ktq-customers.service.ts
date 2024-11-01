//import GeneralKtqCustomerDto from "@/common/dtos/ktq-customers.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomer from '@/entities/ktq-customers.entity';

import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';

@Injectable()
export class KtqCustomersService implements ServiceInterface<KtqCustomer, Partial<KtqCustomer>>, ServiceUserAuthInterface<KtqCustomer> {
    constructor(
        @InjectRepository(KtqCustomer)
        private readonly ktqCustomerRepository: Repository<KtqCustomer>,
    ) {}

    async create(customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        const ktqCustomer = this.ktqCustomerRepository.create(customer);
        return this.ktqCustomerRepository.save(ktqCustomer);
    }

    async findAll(): Promise<KtqCustomer[]> {
        return this.ktqCustomerRepository.find();
    }

    async findOne(id: KtqCustomer['id']): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ id });
    }

    async update(id: KtqCustomer['id'], customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        await this.ktqCustomerRepository.update({ id }, customer);
        return this.findOne(id);
    }

    async delete(id: KtqCustomer['id']): Promise<void> {
        await this.ktqCustomerRepository.delete(id);
    }

    async findByEmail(email: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ email });
    }

    async findByUsername(username: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ username });
    }

    async getById(id: KtqCustomer['id']) {
        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, customer));
    }

    async getAll(query: PaginateQuery) {
        const data = await paginate(query, this.ktqCustomerRepository, {
            sortableColumns: ['id'],
            searchableColumns: [],
            defaultSortBy: [['id', 'DESC']],
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqCustomer>(data, true, KtqCustomer);
    }
}
