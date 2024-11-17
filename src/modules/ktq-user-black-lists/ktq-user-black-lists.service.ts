//import GeneralKtqUserBlackListDto from "@/common/dtos/ktq-user-black-lists.dto";
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class KtqUserBlackListsService implements ServiceInterface<KtqUserBlackList, Partial<KtqUserBlackList>> {
    constructor(
        @InjectRepository(KtqUserBlackList)
        private readonly ktqUserBlackListRepository: Repository<KtqUserBlackList>,
    ) {}

    async create(userBlackList: Partial<KtqUserBlackList>): Promise<KtqUserBlackList> {
        const ktqUserBlackList = this.ktqUserBlackListRepository.create(userBlackList);
        return this.ktqUserBlackListRepository.save(ktqUserBlackList);
    }

    async findAll(): Promise<KtqUserBlackList[]> {
        return this.ktqUserBlackListRepository.find();
    }

    async findOne(id: KtqUserBlackList['id']): Promise<KtqUserBlackList> {
        return this.ktqUserBlackListRepository.findOneBy({ id });
    }

    async update(id: KtqUserBlackList['id'], userBlackList: Partial<KtqUserBlackList>): Promise<KtqUserBlackList> {
        await this.ktqUserBlackListRepository.update({ id }, userBlackList);
        return this.findOne(id);
    }

    async delete(id: KtqUserBlackList['id']): Promise<void> {
        await this.ktqUserBlackListRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqUserBlackList>) {
        return await this.ktqUserBlackListRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqUserBlackList>) {
        return await this.ktqUserBlackListRepository.findOne(options);
    }
}
