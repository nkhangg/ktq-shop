//import GeneralKtqUserBlackListLogDto from "@/common/dtos/ktq-user-black-list-logs.dto";
import KtqUserBlackListLog from '@/entities/ktq-user-black-list-logs.entity';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';

@Injectable()
export class KtqUserBlackListLogsService implements ServiceInterface<KtqUserBlackListLog, Partial<KtqUserBlackListLog>> {
    constructor(
        @InjectRepository(KtqUserBlackListLog)
        private readonly ktqUserBlackListLogRepository: Repository<KtqUserBlackListLog>,
    ) {}

    async create(userBlackListLog: Partial<KtqUserBlackListLog>): Promise<KtqUserBlackListLog> {
        const ktqUserBlackListLog = this.ktqUserBlackListLogRepository.create(userBlackListLog);
        return this.ktqUserBlackListLogRepository.save(ktqUserBlackListLog);
    }

    async findAll(): Promise<KtqUserBlackListLog[]> {
        return this.ktqUserBlackListLogRepository.find();
    }

    async findOne(id: KtqUserBlackListLog['id']): Promise<KtqUserBlackListLog> {
        return this.ktqUserBlackListLogRepository.findOneBy({ id });
    }

    async update(id: KtqUserBlackListLog['id'], userBlackListLog: Partial<KtqUserBlackListLog>): Promise<KtqUserBlackListLog> {
        await this.ktqUserBlackListLogRepository.update({ id }, userBlackListLog);
        return this.findOne(id);
    }

    async delete(id: KtqUserBlackListLog['id']): Promise<void> {
        await this.ktqUserBlackListLogRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqUserBlackListLog>) {
        return await this.ktqUserBlackListLogRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqUserBlackListLog>) {
        return await this.ktqUserBlackListLogRepository.findOne(options);
    }

    async writeLog(data: KtqUserBlackList) {
        return await this.create({
            back_list_type: data.back_list_type,
            end_at: data.end_at,
            start_at: data.start_at,
            reason: data.reason,
            userBlackList: data,
        });
    }
}
