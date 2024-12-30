import KtqResponse from '@/common/systems/response/ktq-response';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqConfig from '@/entities/ktq-configs.entity';
import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, Repository } from 'typeorm';

// @Injectable()
export class KtqConfigsService implements ServiceInterface<KtqConfig, Partial<KtqConfig>> {
    constructor(
        @InjectRepository(KtqConfig)
        private readonly ktqConfigRepository: Repository<KtqConfig>,
    ) {}

    async create(configData: Partial<KtqConfig>): Promise<KtqConfig> {
        const ktqConfig = this.ktqConfigRepository.create(configData);
        return this.ktqConfigRepository.save(ktqConfig);
    }

    async findAll(): Promise<KtqConfig[]> {
        return this.ktqConfigRepository.find();
    }

    async findOne(id: number): Promise<KtqConfig> {
        return this.ktqConfigRepository.findOneBy({ id });
    }

    async update(id: KtqConfig['id'], configData: Partial<KtqConfig>): Promise<KtqConfig> {
        await this.ktqConfigRepository.update(id, configData);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.ktqConfigRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqConfig>) {
        return await this.ktqConfigRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqConfig>) {
        return await this.ktqConfigRepository.findOne(options);
    }

    async getConfig(key_name: string): Promise<KtqConfig> {
        const config = await this.ktqConfigRepository.findOneBy({ key_name });
        if (!config) {
            return null;
        }
        return config;
    }

    async initConfigs() {
        return await this.ktqConfigRepository.save(KtqConfigConstant.getConfigs());
    }

    async getAppHost() {
        const config = await this.findOneWith({ where: { key_name: KtqConfigConstant.CONFIG_APP_HOST } });

        if (!config) return KtqConfigConstant.getAppHost();

        return config;
    }

    async getAppPort() {
        const config = await this.findOneWith({ where: { key_name: KtqConfigConstant.CONFIG_APP_PORT } });

        if (!config) return KtqConfigConstant.getAppPort();

        return config;
    }

    async getApiPrefix() {
        const config = await this.findOneWith({ where: { key_name: KtqConfigConstant.CONFIG_APP_API_PREFIX } });

        if (!config) return KtqConfigConstant.getApiPrefix();

        return config;
    }

    async getApiVersion() {
        const config = await this.findOneWith({ where: { key_name: KtqConfigConstant.CONFIG_APP_API_VERSION } });

        if (!config) return KtqConfigConstant.getApiVersion();

        return config;
    }

    async getPrefixVersion() {
        const prefix = await this.getApiPrefix();
        const version = await this.getApiVersion();

        return `${prefix.key_value}/${version.key_value}`;
    }

    async getCorsSources() {
        const config = await this.findOneWith({ where: { key_name: KtqConfigConstant.CONFIG_APP_CORS_SOURCES } });

        if (!config) return JSON.parse(KtqConfigConstant.getCorsSources().key_value);

        return JSON.parse(config.key_value);
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqConfig> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            key_name: [FilterOperator.ILIKE],
            key_type: [FilterOperator.ILIKE],
            key_space: [FilterOperator.ILIKE],
            key_value: [FilterOperator.ILIKE],
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqConfigRepository, {
            sortableColumns: ['id', 'key_name', 'key_space', 'key_type', 'key_value'],
            searchableColumns: ['id', 'key_name', 'key_space', 'key_type', 'key_value'],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqConfig>(data, true, KtqConfig);
    }
}
