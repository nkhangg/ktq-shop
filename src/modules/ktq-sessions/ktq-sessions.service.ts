import { TTokenData } from '@/common/decorators/token-data.decorator';
import GeneralKtqSessionDto from '@/common/dtos/ktq-sessions.dto';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqSession from '@/entities/ktq-sessions.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class KtqSessionsService implements ServiceInterface<KtqSession, Partial<KtqSession>> {
    constructor(
        @InjectRepository(KtqSession)
        private readonly ktqSessionRepository: Repository<KtqSession>,
    ) {}

    async create(session: Partial<KtqSession>): Promise<KtqSession> {
        const ktqSession = this.ktqSessionRepository.create(session);
        return this.ktqSessionRepository.save(ktqSession);
    }

    async findAll(): Promise<KtqSession[]> {
        return this.ktqSessionRepository.find();
    }

    async findOne(id: KtqSession['id']): Promise<KtqSession> {
        return this.ktqSessionRepository.findOneBy({ id });
    }

    async update(id: KtqSession['id'], session: Partial<KtqSession>): Promise<KtqSession> {
        await this.ktqSessionRepository.update({ id }, { ...session });
        return this.findOne(id);
    }

    async updates(query: FindOptionsWhere<KtqSession>, session: Partial<KtqSession>): Promise<KtqSession[]> {
        await this.ktqSessionRepository.update(query, { ...session });
        return this.ktqSessionRepository.find({ where: query });
    }

    async delete(id: KtqSession['id']): Promise<void> {
        await this.ktqSessionRepository.delete(id);
    }

    async findByCustomer(customer: KtqCustomer) {
        return await this.ktqSessionRepository.findBy({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, live: true });
    }

    async logoutByCustomer(customer: KtqCustomer) {
        return await this.ktqSessionRepository.update({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, live: true }, { live: false });
    }

    async getSessionByData({ payload, ...data }: { user_id: number; user_role_type: UserRoleType; payload?: string }) {
        return await this.ktqSessionRepository.findOne({ where: { ...data, live: true } });
    }

    async findByTokenData(tokenData: TTokenData) {
        return await this.ktqSessionRepository.findOne({ where: { session_token: tokenData.session_key, user_id: tokenData.id, user_role_type: tokenData.class, live: true } });
    }
}
