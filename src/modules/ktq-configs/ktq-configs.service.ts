import KtqConfig from '@/entities/ktq-configs.entity';
import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

interface CreateConfigDto {
    key_name: string;
    key_type: string;
    key_value: string;
}

@Injectable()
export class KtqConfigsService implements ServiceInterface<KtqConfig, CreateConfigDto> {
    constructor(
        @InjectRepository(KtqConfig)
        private readonly ktqConfigRepository: Repository<KtqConfig>,
    ) {}

    async create(configData: CreateConfigDto): Promise<KtqConfig> {
        const ktqConfig = this.ktqConfigRepository.create(configData);
        return this.ktqConfigRepository.save(ktqConfig);
    }

    async findAll(): Promise<KtqConfig[]> {
        return this.ktqConfigRepository.find();
    }

    async findOne(id: number): Promise<KtqConfig> {
        return this.ktqConfigRepository.findOneBy({ id });
    }

    async update(id: KtqConfig['id'], configData: CreateConfigDto): Promise<KtqConfig> {
        await this.ktqConfigRepository.update(id, configData);
        return this.findOne(id);
    }

    async delete(id: number): Promise<void> {
        await this.ktqConfigRepository.delete(id);
    }

    async getConfig(key_name: string): Promise<KtqConfig> {
        const config = await this.ktqConfigRepository.findOneBy({ key_name });
        if (!config) {
            return null;
        }
        return config;
    }
}
