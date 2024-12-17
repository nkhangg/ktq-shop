//import GeneralKtqCustomerGroupDto from "@/common/dtos/ktq-customer-groups.dto";
import GeneralKtqCustomerGroupDto from '@/common/dtos/ktq-customer-groups.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomerGroupsConstant from '@/constants/ktq-customer-groups.constant';
import KtqCustomerGroup from '@/entities/ktq-customer-groups.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, Repository } from 'typeorm';
import { KtqCustomersService } from '../ktq-customers/ktq-customers.service';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { customerGroupRoutes } from './ktq-customer-groups.route';

@Injectable()
export class KtqCustomerGroupsService implements ServiceInterface<KtqCustomerGroup, Partial<KtqCustomerGroup>> {
    constructor(
        @InjectRepository(KtqCustomerGroup)
        private readonly ktqCustomerGroupRepository: Repository<KtqCustomerGroup>,
        private readonly ktqCacheService: KtqCachesService,
    ) {}

    async create(customerGroup: Partial<KtqCustomerGroup>): Promise<KtqCustomerGroup> {
        const ktqCustomerGroup = this.ktqCustomerGroupRepository.create(customerGroup);
        return this.ktqCustomerGroupRepository.save(ktqCustomerGroup);
    }

    async findAll(): Promise<KtqCustomerGroup[]> {
        return this.ktqCustomerGroupRepository.find();
    }

    async findOne(id: KtqCustomerGroup['id']): Promise<KtqCustomerGroup> {
        return this.ktqCustomerGroupRepository.findOneBy({ id });
    }

    async update(id: KtqCustomerGroup['id'], customerGroup: Partial<KtqCustomerGroup>): Promise<KtqCustomerGroup> {
        await this.ktqCustomerGroupRepository.update({ id }, customerGroup);
        return this.findOne(id);
    }

    async delete(id: KtqCustomerGroup['id']): Promise<void> {
        await this.ktqCustomerGroupRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqCustomerGroup>) {
        return await this.ktqCustomerGroupRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqCustomerGroup>) {
        return await this.ktqCustomerGroupRepository.findOne(options);
    }

    async initCustomerGroups() {
        this.ktqCustomerGroupRepository.save(KtqCustomerGroupsConstant.getGroups());
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqCustomerGroup> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            name: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqCustomerGroupRepository, {
            sortableColumns: ['id', 'name', 'created_at', 'updated_at'],
            searchableColumns: ['name', 'id'],
            filterableColumns,
            maxLimit: 100,
            relations: {
                customers: true,
            },
        });

        return KtqResponse.toPagination<KtqCustomerGroup>(data, true, KtqCustomerGroup);
    }

    async createCustomerGroup(data: GeneralKtqCustomerGroupDto) {
        const result = await this.create({ name: data.name });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't create now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(customerGroupRoutes.key());

        return KtqResponse.toResponse(plainToClass(KtqCustomerGroup, result));
    }

    async updateCustomerGroup(id: KtqCustomerGroup['id'], data: GeneralKtqCustomerGroupDto) {
        const group = await this.findOne(id);

        if (!group) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Not found data`, status_code: HttpStatusCode.NotFound }));

        const result = await this.update(id, { name: data.name });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't update now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(customerGroupRoutes.key());

        return KtqResponse.toResponse(plainToClass(KtqCustomerGroup, result));
    }

    async deleteCustomerGroup(id: KtqCustomerGroup['id']) {
        const group = await this.findOne(id);

        if (!group) throw new NotFoundException(KtqResponse.toResponse(false, { message: `Not found data`, status_code: HttpStatusCode.NotFound }));

        try {
            await this.delete(id);
        } catch (error) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: `Can't delete this group` }));
        }

        await this.ktqCacheService.clearKeysByPrefix(customerGroupRoutes.key());
        return KtqResponse.toResponse(true);
    }
}
