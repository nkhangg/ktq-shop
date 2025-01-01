import { CreateKtqConfigDto, DeleteKtqConfigDto, UpdateKtqConfigDto, UpdatePublicKtqConfigDto } from '@/common/dtos/ktq-configs.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqConfig from '@/entities/ktq-configs.entity';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, forwardRef, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { KtqConfigsRoutes } from './ktq-configs.route';
import { KeySpace } from '@/common/enums/key-space.enum';
import { prefixPublicUrl } from '@/utils/app';

// @Injectable()
export class KtqConfigsService implements ServiceInterface<KtqConfig, Partial<KtqConfig>> {
    constructor(
        @InjectRepository(KtqConfig)
        private readonly ktqConfigRepository: Repository<KtqConfig>,
        private readonly ktqCacheService: KtqCachesService,
        @Inject(forwardRef(() => KtqConfigsRoutes)) private ktqConfigsRoutes: KtqConfigsRoutes,
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

    async getAllPublicConfigs(query: PaginateQuery) {
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
            where: {
                key_space: KeySpace.PUBLIC,
            },
        });

        return KtqResponse.toPagination<KtqConfig>(data, true, KtqConfig);
    }

    async getPublicConfig(key_name: string) {
        const config = await this.ktqConfigRepository.findOneBy({ key_name, key_space: KeySpace.PUBLIC });

        if (!config) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found config', status_code: HttpStatusCode.NotFound }));

        return KtqResponse.toResponse(config);
    }

    async updatePublicConfig(key_name: string, data: UpdatePublicKtqConfigDto) {
        const config = await this.ktqConfigRepository.findOneBy({ key_name, key_space: KeySpace.PUBLIC });

        if (!config) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found config', status_code: HttpStatusCode.NotFound }));

        const result = await this.update(config.id, { ...config, ...data });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null));

        await this.clearCacheByPublicKeyName();

        return KtqResponse.toResponse(result);
    }

    async clearCacheByKey() {
        const prefix = await this.ktqConfigsRoutes.key();
        await this.ktqCacheService.clearKeysByPrefix(prefix);
    }

    async clearCacheByPublicKeyName() {
        const prefix = await this.ktqConfigsRoutes.public_keys();
        await this.ktqCacheService.clearPublicKeysByPrefix(prefix);
    }

    async createConfig(data: CreateKtqConfigDto) {
        const result = await this.create({ ...data });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null));

        await this.clearCacheByKey();
        return KtqResponse.toResponse(result);
    }

    async updateConfig(id: KtqConfig['id'], data: UpdateKtqConfigDto) {
        const config = await this.findOne(id);

        if (!config) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found config', status_code: HttpStatusCode.NotFound }));

        const result = await this.update(id, data);

        if (!result) throw new BadRequestException(null);

        await this.clearCacheByKey();

        return KtqResponse.toResponse(result);
    }

    async deleteConfigs({ ids }: DeleteKtqConfigDto) {
        const result = await this.ktqConfigRepository.delete(ids);

        if (!result) throw new BadRequestException(false);

        await this.clearCacheByKey();

        return KtqResponse.toResponse(true, { message: `Deleted ${result.affected} rows` });
    }
}
