import { TTokenData } from '@/common/decorators/token-data.decorator';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqSession from '@/entities/ktq-sessions.entity';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, FindOptionsWhere, In, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/ktq-caches.service';
import { sessionsRoutes } from './ktq-sessions.route';

@Injectable()
export class KtqSessionsService implements ServiceInterface<KtqSession, Partial<KtqSession>> {
    constructor(
        @InjectRepository(KtqSession)
        private readonly ktqSessionRepository: Repository<KtqSession>,
        private readonly ktqCachesService: KtqCachesService,
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

    async deleteByCustomerIds(ids: KtqCustomer['id'][]) {
        return await this.ktqSessionRepository.delete({
            user_id: In(ids),
            user_role_type: UserRoleType.CUSTOMER,
        });
    }

    async findWith(options?: FindManyOptions<KtqSession>) {
        return await this.ktqSessionRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqSession>) {
        return await this.ktqSessionRepository.findOne(options);
    }

    async findByCustomer(customer: KtqCustomer) {
        return await this.ktqSessionRepository.findBy({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, live: true });
    }

    async logoutByCustomer(customer: KtqCustomer) {
        return await this.ktqSessionRepository.update({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, live: true }, { live: false });
    }

    async getSessionByData({
        clientInfo,
        ...data
    }: {
        user_id: number;
        user_role_type: UserRoleType;
        clientInfo?: {
            clientIp: string;
            userAgent: string;
            deviceType: any;
        };
    }) {
        return await this.ktqSessionRepository.findOne({ where: { ...data, live: true, user_agent: clientInfo.userAgent } });
    }

    async findByTokenData(tokenData: TTokenData) {
        return await this.ktqSessionRepository.findOne({ where: { session_token: tokenData.session_key, user_id: tokenData.id, user_role_type: tokenData.class, live: true } });
    }

    async getSessionsByCustomer(id: KtqCustomer['id'], query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqSession> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqSessionRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['payload', 'user_agent', 'id'],
            filterableColumns,
            maxLimit: 100,
            where: {
                user_id: id,
                user_role_type: UserRoleType.CUSTOMER,
            },
        });

        return KtqResponse.toPagination<KtqSession>(data, true, KtqSession);
    }

    async getSessionsByAdmin(id: KtqCustomer['id'], query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqSession> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqSessionRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['payload', 'user_agent', 'id'],
            filterableColumns,
            maxLimit: 100,
            where: {
                user_id: id,
                user_role_type: UserRoleType.ADMIN,
            },
        });

        return KtqResponse.toPagination<KtqSession>(data, true, KtqSession);
    }

    async logoutCustomer({ id_session, user_id }: { user_id: KtqCustomer['id']; id_session: KtqSession['id'] }) {
        const session = await this.findOneWith({
            where: {
                user_id,
                id: id_session,
            },
        });

        if (!session.live) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Session was logout', status_code: HttpStatusCode.BadRequest }));
        }

        const updatedSession = await this.update(session.id, { live: false });

        // clear cache
        console.log(sessionsRoutes.getByCustomer(user_id));
        this.ktqCachesService.clearKeysByPrefix(sessionsRoutes.getByCustomer(user_id));
        return KtqResponse.toResponse(plainToClass(KtqSession, updatedSession));
    }

    async logoutsCustomer({ ids_session, user_id }: { user_id: KtqCustomer['id']; ids_session: KtqSession['id'][] }) {
        const updatedSessions = await this.ktqSessionRepository.update(ids_session, { live: false });

        if (!updatedSessions.affected) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Can't found data`, status_code: HttpStatusCode.NotFound }));

        // clear cache
        this.ktqCachesService.clearKeysByPrefix(sessionsRoutes.getByCustomer(user_id));
        return KtqResponse.toResponse(plainToClass(KtqSession, updatedSessions));
    }

    async getCustomersOnline(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqSession> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            created_at: true,
            updated_at: true,
        };

        const queryBuilder = this.ktqSessionRepository
            .createQueryBuilder('session')
            .innerJoin(
                (qb) => qb.select('s.user_id', 'user_id').addSelect('MAX(s.expires_at)', 'max_expires_at').from('ktq_sessions', 's').groupBy('s.user_id'),
                'latest',
                'session.user_id = latest.user_id AND session.expires_at = latest.max_expires_at',
            )
            .where('session.user_role_type = :role', { role: UserRoleType.CUSTOMER });

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, queryBuilder, {
            sortableColumns: ['id'],
            searchableColumns: [],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqSession>(data, false, KtqSession);
    }
}
