//import GeneralKtqAddressDto from "@/common/dtos/ktq-addresses.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqAddress from '@/entities/ktq-addresses.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';

import { CreateKtqAddressDto, UpdateKtqAddressDto } from '@/common/dtos/ktq-addresses.dto';
import KtqCountry from '@/entities/ktq-countries.entity';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, In, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { adRoutes } from './ktq-address.route';

@Injectable()
export class KtqAddressesService implements ServiceInterface<KtqAddress, Partial<KtqAddress>> {
    constructor(
        @InjectRepository(KtqAddress)
        private readonly ktqAddressRepository: Repository<KtqAddress>,
        @InjectRepository(KtqCustomer)
        private readonly KtqCustomerRepository: Repository<KtqCustomer>,
        @InjectRepository(KtqCountry)
        private readonly ktqCountryRepository: Repository<KtqCountry>,
        private readonly ktqCacheService: KtqCachesService,
    ) {}

    async create(address: Partial<KtqAddress>): Promise<KtqAddress> {
        const ktqAddress = this.ktqAddressRepository.create(address);
        return this.ktqAddressRepository.save(ktqAddress);
    }

    async findAll(): Promise<KtqAddress[]> {
        return this.ktqAddressRepository.find();
    }

    async findOne(id: KtqAddress['id']): Promise<KtqAddress> {
        return this.ktqAddressRepository.findOneBy({ id });
    }

    async update(id: KtqAddress['id'], address: Partial<KtqAddress>): Promise<KtqAddress> {
        await this.ktqAddressRepository.update({ id }, address);
        return this.findOne(id);
    }

    async delete(id: KtqAddress['id']): Promise<void> {
        await this.ktqAddressRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqAddress>) {
        return await this.ktqAddressRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqAddress>) {
        return await this.ktqAddressRepository.findOne(options);
    }

    async findByCustomer(id: KtqCustomer['id']) {
        return this.findOneWith({ where: { customer: { id } } });
    }

    async findByCustomerIsDefault(id: KtqCustomer['id']) {
        return this.findOneWith({ where: { customer: { id }, is_default: true } });
    }

    async getByCustomer(id: KtqCustomer['id'], query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqAddress> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            city: [FilterOperator.ILIKE],
            address_line: [FilterOperator.ILIKE],
            postal_code: [FilterOperator.ILIKE],
            ward: [FilterOperator.ILIKE],
            district: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqAddressRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['address_line', 'id', 'city', 'country.country_name', 'postal_code', 'ward', 'district'],
            filterableColumns,
            defaultSortBy: [['id', 'DESC']],
            maxLimit: 100,
            where: {
                customer: {
                    id,
                },
            },
            relations: {
                country: true,
            },
        });

        return KtqResponse.toPagination<KtqAddress>(data, false, KtqAddress);
    }

    async setDefaultAddressByCustomer(address_id: KtqAddress['id'], customer_id: KtqCustomer['id']) {
        const customer = await this.KtqCustomerRepository.findOne({ where: { id: customer_id } });

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Customer not found', status_code: HttpStatusCode.NotFound }));

        const defaultAddress = await this.findByCustomerIsDefault(customer.id);

        if (!defaultAddress) {
            const result = await this.update(address_id, { is_default: true });

            if (result) {
                await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));
                return KtqResponse.toResponse(result);
            }
        }

        if (defaultAddress.id === address_id) {
            await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));
            return KtqResponse.toResponse(defaultAddress);
        }

        const result = await this.update(address_id, { is_default: true });
        await this.update(defaultAddress.id, { is_default: false });
        await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));

        return KtqResponse.toResponse(result);
    }

    async deletesByCustomer(address_ids: KtqAddress['id'][], customer_id: KtqCustomer['id']) {
        const result = await this.ktqAddressRepository.delete({ id: In(address_ids), is_default: false, customer: { id: customer_id } });

        if (!result.affected) throw new BadRequestException(KtqResponse.toResponse(false, { message: "Can't delete now", status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));

        return KtqResponse.toResponse(true);
    }

    async deleteByCustomer(address_id: KtqAddress['id'], customer_id: KtqCustomer['id']) {
        const address = await this.findOne(address_id);

        if (!address) {
            throw new NotFoundException(KtqResponse.toResponse(false, { message: 'Address not found', status_code: HttpStatusCode.NotFound }));
        }

        if (address.is_default) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: "Can't delete address default", status_code: HttpStatusCode.BadRequest }));
        }

        const result = await this.ktqAddressRepository.delete({ id: address_id, is_default: false, customer: { id: customer_id } });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(false, { message: "Can't delete now", status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));

        return KtqResponse.toResponse(true);
    }

    async createAddressByCustomer({ customer_id, address_line, country_id, district, province, ward, postal_code }: CreateKtqAddressDto) {
        const defaultAddress = await this.findByCustomerIsDefault(customer_id);

        const country = await this.ktqCountryRepository.findOne({ where: { id: country_id } });

        const customer = await this.KtqCustomerRepository.findOne({ where: { id: customer_id } });

        const newAddress = await this.create({
            address_line: address_line,
            city: province,
            country: country,
            ward,
            district,
            postal_code,
            customer,
            is_default: !defaultAddress,
        });

        if (!newAddress) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't create a new address now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));

        return KtqResponse.toResponse(newAddress);
    }

    async updateAddressByCustomer({ customer_id, address_line, country_id, district, province, ward, postal_code, address_id }: UpdateKtqAddressDto) {
        const country = await this.ktqCountryRepository.findOne({ where: { id: country_id } });

        const newAddress = await this.update(address_id, {
            address_line: address_line,
            city: province,
            country: country,
            ward,
            district,
            postal_code,
        });

        if (!newAddress) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't create a new address now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(adRoutes.byCustomer(customer_id));

        return KtqResponse.toResponse(newAddress);
    }
}
