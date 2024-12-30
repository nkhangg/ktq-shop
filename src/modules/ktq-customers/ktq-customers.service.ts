//import GeneralKtqCustomerDto from "@/common/dtos/ktq-customers.dto";
import GeneralKtqCustomerDto, { CreateKtqCustomerDto, UpdatesKtqCustomerDto } from '@/common/dtos/ktq-customers.dto';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { cleanObject } from '@/utils/app';
import moment from '@/utils/moment';
import { writeFile } from 'fs/promises';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { join } from 'path';
import { FindManyOptions, In, IsNull, LessThanOrEqual, Not, Raw, Repository } from 'typeorm';
import { KtqAddressesService } from '../ktq-addresses/ktq-addresses.service';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';
import { KtqUserBlackListsService } from '../ktq-user-black-lists/ktq-user-black-lists.service';
import { customersRoutes } from './ktq-customers.route';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import KtqAppConstant from '@/constants/ktq-app.constant';
import { KtqCustomerGroupsService } from '../ktq-customer-groups/ktq-customer-groups.service';
import { RegisterKtqCustomerDto } from '@/common/dtos/ktq-authentication.dto';
import KtqCustomerGroupsConstant from '@/constants/ktq-customer-groups.constant';

@Injectable()
export class KtqCustomersService implements ServiceInterface<KtqCustomer, Partial<KtqCustomer>>, ServiceUserAuthInterface<KtqCustomer> {
    constructor(
        @InjectRepository(KtqCustomer)
        private readonly ktqCustomerRepository: Repository<KtqCustomer>,
        private readonly ktqSessionService: KtqSessionsService,
        private readonly ktqCachesService: KtqCachesService,
        private readonly ktqBlackListService: KtqUserBlackListsService,
        private readonly ktqAddressesService: KtqAddressesService,
        private readonly ktqCustomerGroupService: KtqCustomerGroupsService,
    ) {}

    async create(customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        const ktqCustomer = this.ktqCustomerRepository.create(customer);
        return this.ktqCustomerRepository.save(ktqCustomer);
    }

    async findAll(): Promise<KtqCustomer[]> {
        return this.ktqCustomerRepository.find();
    }

    async findOne(id: KtqCustomer['id']): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ id });
    }

    async update(id: KtqCustomer['id'], customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        await this.ktqCustomerRepository.update({ id }, customer);
        return this.findOne(id);
    }

    async updates({ ids, ...data }: UpdatesKtqCustomerDto): Promise<any> {
        const customerInfo = cleanObject(data);

        const result = await this.ktqCustomerRepository.update(ids, { ...customerInfo, date_of_birth: customerInfo.date_of_birth });

        if (!result?.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(true);
    }

    async delete(id: KtqCustomer['id']): Promise<void> {
        await this.ktqCustomerRepository.delete(id);
    }

    async findByEmail(email: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ email });
    }

    async findByUsername(username: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ username, is_active: true });
    }

    async findOneWith(options?: FindManyOptions<KtqCustomer>) {
        return await this.ktqCustomerRepository.findOne(options);
    }

    async getById(id: KtqCustomer['id']) {
        const customer = await this.ktqCustomerRepository.findOne({
            where: { id },
            relations: {
                customerGroup: true,
            },
        });

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, customer));
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqCustomer> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            username: [FilterOperator.ILIKE],
            email: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqCustomerRepository, {
            sortableColumns: ['id', 'username', 'email', 'created_at', 'updated_at'],
            searchableColumns: ['username', 'email'],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqCustomer>(data, true, KtqCustomer);
    }

    async inactive(id: KtqCustomer['id']) {
        const customer = await this.findOne(id);

        if (!customer) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));
        }

        const result = await this.update(customer.id, { is_active: false });

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(plainToClass(KtqCustomer, result));
    }

    async inActives(ids: KtqCustomer['id'][]) {
        const result = await this.ktqCustomerRepository.update(ids, { is_active: false });

        if (!result?.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(true);
    }

    async active(id: KtqCustomer['id']) {
        const customer = await this.findOne(id);

        if (!customer) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));
        }

        const result = await this.update(customer.id, { is_active: true });

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(plainToClass(KtqCustomer, result));
    }

    async actives(ids: KtqCustomer['id'][]) {
        const result = await this.ktqCustomerRepository.update({ id: In(ids) }, { is_active: true });

        if (!result?.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(true);
    }

    async deletes(ids: KtqCustomer['id'][]) {
        const result = await this.ktqCustomerRepository.delete(ids);

        const resultSessions = await this.ktqSessionService.deleteByCustomerIds(ids);

        if (!result || !resultSessions) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't delete with data`, status_code: HttpStatusCode.BadRequest }));

        if (!result.affected) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Can't found data`, status_code: HttpStatusCode.NotFound }));

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(true, { message: `Delete success ${result.affected} items` });
    }

    async updateById(id: KtqCustomer['id'], { group_id, ...data }: GeneralKtqCustomerDto) {
        const customer = await this.ktqCustomerRepository.findOne({
            where: { id },
            relations: { customerGroup: true },
        });

        let logouts = null;
        let newDataCustomer = null;

        if (!customer) throw new NotFoundException('The customer is not found');

        if (data?.password && !bcrypt.compareSync(data.password, customer.password)) {
            const new_hash_pass = bcrypt.hashSync(data.password);

            newDataCustomer = { ...customer, ...data, password: new_hash_pass };

            logouts = this.ktqSessionService.logoutByCustomer(customer);

            if (!logouts) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The session not cleared`, status_code: HttpStatusCode.BadRequest }));
        } else {
            newDataCustomer = { ...customer, ...data };
        }

        if (group_id && group_id !== customer.customerGroup.id) {
            const customerGroup = await this.ktqCustomerGroupService.findOne(group_id);

            newDataCustomer['customerGroup'] = customerGroup;
        }

        const result = await this.update(customer.id, newDataCustomer);

        if (!result)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `The error when update ${customer?.username}`, status_code: HttpStatusCode.BadRequest }));

        this.ktqCachesService.clearKeysByPrefix(`${customersRoutes.key()}/${id}`);
        return KtqResponse.toResponse(plainToClass(KtqCustomer, result), { message: logouts ? `This customer password changed. Please re-login to use` : 'Update success' });
    }

    async deleteCustomer(id: KtqCustomer['id']) {
        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));

        await this.delete(customer.id);

        await this.ktqSessionService.deleteByCustomerIds([id]);

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());

        return KtqResponse.toResponse(true);
    }

    async getCustomerView(id: KtqCustomer['id']) {
        const customer = await this.ktqCustomerRepository.findOne({
            where: {
                id,
            },
            relations: {
                customerGroup: true,
                addresses: true,
            },
        });

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));

        const now = moment().toDate();

        const session = await this.ktqSessionService.findOneWith({
            where: { user_id: customer.id, user_role_type: UserRoleType.CUSTOMER },
            order: { expires_at: 'DESC' },
            take: 1,
        });

        const blacklist = await this.ktqBlackListService.findOneWith({
            where: {
                user_role_type: UserRoleType.CUSTOMER,
                user_id_app: customer.id,
                start_at: Not(IsNull()),
                // start_at: LessThanOrEqual(now),
                // // end_at: MoreThanOrEqual(now),
                // end_at: Raw((alias) => `${alias} >= :now OR ${alias} IS NULL`, { now }),
            },
        });

        const address = customer.addresses.find((address) => address.is_default) ?? null;

        return KtqResponse.toResponse({
            last_login_in: session?.expires_at ?? now,
            online: session?.expires_at ? moment(session.expires_at).isAfter(now) : false,
            blacklist,
            customer: plainToClass(KtqCustomer, customer),
            group: customer.customerGroup,
            address_default: address,
        });
    }

    async uploadAvatar(id: KtqCustomer['id'], avatar: Express.Multer.File) {
        if (!avatar) {
            throw new BadRequestException('File is required');
        }

        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Customer is not found', status_code: HttpStatusCode.NotFound }));

        if (customer.avatar) {
            const filePath = KtqAppConstant.customerMediaFilePath(customer.avatar);

            if (existsSync(filePath)) {
                try {
                    unlinkSync(filePath);
                } catch (error) {
                    console.error('Error while deleting the file:', error);
                }
            }
        }

        const name = avatar.filename;

        const result = await this.update(customer.id, { avatar: name });

        if (!result) throw new BadRequestException('Update avatar failure');

        return KtqResponse.toResponse(plainToClass(KtqCustomer, result));
    }

    async uploadBgCover(id: KtqCustomer['id'], avatar: Express.Multer.File) {
        if (!avatar) {
            throw new BadRequestException('File is required');
        }

        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Customer is not found', status_code: HttpStatusCode.NotFound }));

        if (customer.avatar) {
            const filePath = KtqAppConstant.customerMediaFilePath(customer.avatar);

            if (existsSync(filePath)) {
                try {
                    unlinkSync(filePath);
                } catch (error) {
                    console.error('Error while deleting the file:', error);
                }
            }
        }

        const name = avatar.filename;

        const result = await this.update(customer.id, { bg_cover: name });

        if (!result) throw new BadRequestException('Update background cover failure');

        return KtqResponse.toResponse(plainToClass(KtqCustomer, result));
    }

    async deleteMedia(id: KtqCustomer['id'], attr: 'bg_cover' | 'avatar') {
        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Customer is not found', status_code: HttpStatusCode.NotFound }));

        if (customer.avatar) {
            const filePath = KtqAppConstant.customerMediaFilePath(customer.avatar);

            if (existsSync(filePath)) {
                try {
                    unlinkSync(filePath);
                } catch (error) {
                    console.error('Error while deleting the file:', error);
                }
            }
        }

        const result = await this.update(customer.id, { [attr]: null });

        if (!result) throw new BadRequestException(`Delete ${attr} failure`);

        return KtqResponse.toResponse(plainToClass(KtqCustomer, result));
    }

    async getCustomersOnline(query: PaginateQuery) {
        const queryBuilder = this.ktqCustomerRepository
            .createQueryBuilder('customer')
            .innerJoin(
                (qb) =>
                    qb
                        .select('s.user_id', 'user_id')
                        .addSelect('MAX(s.expires_at)', 'max_expires_at')
                        .from('ktq_sessions', 's')
                        .where('s.user_role_type = :role', { role: UserRoleType.CUSTOMER })
                        .groupBy('s.user_id'),
                'latest',
                'customer.id = latest.user_id',
            );

        const filterableColumns: {
            [key in Column<KtqCustomer> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            username: [FilterOperator.ILIKE],
            email: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, queryBuilder, {
            sortableColumns: ['id', 'username', 'email', 'created_at', 'updated_at'],
            searchableColumns: ['username', 'email'],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqCustomer>(data, true, KtqCustomer);
    }

    async createCustomer({ username, password, email, date_of_birth, group_id, ...prev }: CreateKtqCustomerDto) {
        const password_hash = bcrypt.hashSync(password);

        let customerGroup = KtqCustomerGroupsConstant.getCustomerGeneralGroup();

        if (group_id) {
            customerGroup = await this.ktqCustomerGroupService.findOne(group_id);
        }

        const newCustomer = await this.create({
            ...prev,
            email,
            password: password_hash,
            username,
            customerGroup,
            date_of_birth: moment(date_of_birth).toString() ?? null,
        });

        this.ktqCachesService.clearKeysByPrefix(customersRoutes.key());
        return KtqResponse.toResponse(plainToClass(KtqCustomer, newCustomer));
    }
}
