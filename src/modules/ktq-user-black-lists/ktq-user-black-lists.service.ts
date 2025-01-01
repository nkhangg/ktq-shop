//import GeneralKtqUserBlackListDto from "@/common/dtos/ktq-user-black-lists.dto";
import { BlockKtqAdminUserDto, BlockKtqCustomerDto, BlockKtqCustomersDto } from '@/common/dtos/ktq-user-black-lists.dto';
import { BackListType } from '@/common/enums/back-list-type.enum';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqUserBlackList from '@/entities/ktq-user-black-lists.entity';

import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { ServiceInterface } from '@/services/service-interface';
import moment from '@/utils/moment';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FindManyOptions, In, IsNull, Not, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { KtqCustomersRoutes } from '../ktq-customers/ktq-customers.route';
import { KtqUserBlackListLogsService } from '../ktq-user-black-list-logs/ktq-user-black-list-logs.service';
import { KtqUserBlackListsRoutes } from './ktq-user-black-lists.route';

@Injectable()
export class KtqUserBlackListsService implements ServiceInterface<KtqUserBlackList, Partial<KtqUserBlackList>> {
    constructor(
        @InjectRepository(KtqUserBlackList)
        private readonly ktqUserBlackListRepository: Repository<KtqUserBlackList>,
        private readonly ktqUserBlackListLogService: KtqUserBlackListLogsService,
        private readonly ktqCacheService: KtqCachesService,
        private readonly ktqCustomerRoues: KtqCustomersRoutes,
        private readonly ktqUserBlackListRoutes: KtqUserBlackListsRoutes,
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

    async blockCustomers(data: BlockKtqCustomersDto) {
        if (data.to && !data.from) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'From value is not null', status_code: HttpStatusCode.BadRequest }));
        }

        if (moment(data.from).isAfter(moment(data.to))) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'From value is not after To value', status_code: HttpStatusCode.BadRequest }));
        }

        const result = await this.ktqUserBlackListRepository.update(
            { user_id_app: In(data.ids), user_role_type: UserRoleType.CUSTOMER, back_list_type: BackListType.BLOCK },
            {
                start_at: data.from,
                end_at: data.to,
            },
        );

        if (!result.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Block failure', status_code: HttpStatusCode.BadRequest }));
        }

        return KtqResponse.toResponse(true);
    }

    async clearCustomerCacheById(id: KtqCustomer['id']) {
        const prefix = await this.ktqCustomerRoues.id(id);
        await this.ktqCacheService.clearKeysByPrefix(prefix);
    }

    async blockCustomer({ customer_id, ...data }: BlockKtqCustomerDto) {
        const blackList = await this.findOneWith({
            where: {
                user_id_app: customer_id,
                user_role_type: UserRoleType.CUSTOMER,
            },
        });

        let result = null;

        if (blackList) {
            result = await this.update(blackList.id, {
                ...blackList,
                start_at: data.from,
                end_at: data.to,
                back_list_type: data.black_list_type,
                reason: data.reason,
            });
        } else {
            let newBlackListData: KtqUserBlackList = {
                ...blackList,
                user_id_app: customer_id,
                user_role_type: UserRoleType.CUSTOMER,
                start_at: data.from,
                end_at: data.to,
                back_list_type: data.black_list_type,
                reason: data.reason,
            };

            result = await this.ktqUserBlackListRepository.save(newBlackListData);
        }

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: "Can't update black list on now" }));

        await this.ktqUserBlackListLogService.writeLog(result);
        await this.clearCustomerCacheById(result.user_id_app);
        return KtqResponse.toResponse(result);
    }

    async blockAdminUser({ admin_user_id, admin_password, use_time, ...data }: BlockKtqAdminUserDto) {
        const blackList = await this.findOneWith({
            where: {
                user_id_app: admin_user_id,
                user_role_type: UserRoleType.ADMIN,
            },
        });

        let result = null;

        if (blackList) {
            result = await this.update(blackList.id, {
                ...blackList,
                start_at: data.from,
                end_at: data.to,
                back_list_type: data.black_list_type,
                reason: data.reason,
            });
        } else {
            let newBlackListData: KtqUserBlackList = {
                ...blackList,
                user_id_app: admin_user_id,
                user_role_type: UserRoleType.ADMIN,
                start_at: data.from,
                end_at: data.to,
                back_list_type: data.black_list_type,
                reason: data.reason,
            };

            result = await this.ktqUserBlackListRepository.save(newBlackListData);
        }

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: "Can't update black list on now" }));

        await this.ktqUserBlackListLogService.writeLog(result);
        await this.clearCacheByAdminUser(result.user_id_app);

        return KtqResponse.toResponse(result);
    }

    async unlockCustomer(id: KtqCustomer['id']) {
        const blacklist = await this.findOneWith({ where: { user_id_app: id, user_role_type: UserRoleType.CUSTOMER } });

        if (!blacklist) throw new BadRequestException(KtqResponse.toResponse(null, { message: "Can't found data" }));

        const result = await this.update(blacklist.id, { start_at: null, end_at: null });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Data not found' }));

        await this.ktqUserBlackListLogService.writeLog(result);
        await this.clearCustomerCacheById(result.user_id_app);

        return KtqResponse.toResponse(result);
    }

    async clearCacheByAdminUser(admin_user_id: KtqAdminUser['id']) {
        const prefix = await this.ktqUserBlackListRoutes.byAdminUser(admin_user_id);

        await this.ktqCacheService.clearKeysByPrefix(prefix);
    }

    async unlockAdminUser(id: KtqAdminUser['id']) {
        const blacklist = await this.findOneWith({ where: { user_id_app: id, user_role_type: UserRoleType.ADMIN } });

        if (!blacklist) throw new BadRequestException(KtqResponse.toResponse(null, { message: "Can't found data" }));

        const result = await this.update(blacklist.id, { start_at: null, end_at: null });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Data not found' }));

        await this.ktqUserBlackListLogService.writeLog(result);
        await this.clearCacheByAdminUser(result.user_id_app);

        return KtqResponse.toResponse(result);
    }

    async getBlockAdminId(id: KtqAdminUser['id']) {
        // const now = moment().toDate();

        const admin = await this.findOneWith({
            where: {
                user_id_app: id,
                user_role_type: UserRoleType.ADMIN,
                start_at: Not(IsNull()),
                // end_at: Raw((alias) => `${alias} >= :now OR ${alias} IS NULL`, { now }),
            },
        });

        return KtqResponse.toResponse(admin || null);
    }
}
