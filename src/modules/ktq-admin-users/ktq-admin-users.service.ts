import { TTokenData } from '@/common/decorators/token-data.decorator';
import { ChangePasswordKtqAdminUserDto, CreateKtqAdminUserDto, SetNewPasswordKtqAdminUserDto, UpdateKtqAdminUserDto } from '@/common/dtos/ktq-admin-users.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqAppConstant from '@/constants/ktq-app.constant';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, FindOneOptions, In, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { adminUserRoutes } from './ktq-admin-users.route';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';

@Injectable()
export class KtqAdminUsersService implements ServiceInterface<KtqAdminUser, Partial<KtqAdminUser>>, ServiceUserAuthInterface<KtqAdminUser> {
    constructor(
        @InjectRepository(KtqAdminUser)
        private readonly ktqAdminUserRepository: Repository<KtqAdminUser>,
        private readonly ktqCacheService: KtqCachesService,
        private readonly ktqSessionService: KtqSessionsService,
    ) {}

    async create(adminUser: Partial<KtqAdminUser>): Promise<KtqAdminUser> {
        const ktqAdminUser = this.ktqAdminUserRepository.create(adminUser);
        return this.ktqAdminUserRepository.save(ktqAdminUser);
    }

    async findAll(): Promise<KtqAdminUser[]> {
        return this.ktqAdminUserRepository.find();
    }

    async findOne(id: KtqAdminUser['id'], active?: true): Promise<KtqAdminUser> {
        return this.ktqAdminUserRepository.findOneBy({ id, is_active: active });
    }

    async findOneWithRelation(options: FindOneOptions<KtqAdminUser>) {
        return this.ktqAdminUserRepository.findOne(options);
    }

    async update(id: KtqAdminUser['id'], adminUser: Partial<KtqAdminUser>): Promise<KtqAdminUser> {
        await this.ktqAdminUserRepository.update(id, adminUser);
        return this.findOne(id);
    }

    async delete(id: KtqAdminUser['id']): Promise<void> {
        await this.ktqAdminUserRepository.delete(id);
    }

    async findByUsername(username: string): Promise<KtqAdminUser> {
        return await this.ktqAdminUserRepository.findOne({ where: { username, is_active: true } });
    }

    async findByEmail(email: string): Promise<KtqAdminUser> {
        return await this.ktqAdminUserRepository.findOne({ where: { email, is_active: true } });
    }

    async findByUsernameAndEmail(username: string, email: string) {
        return await this.ktqAdminUserRepository.findOne({ where: { email, username, is_active: true } });
    }
    async findRootAdmin() {
        const { email, username } = KtqAppConstant.getRootUserData();

        return await this.findByUsernameAndEmail(username, email);
    }

    async initRootAdmin() {
        const adminData = KtqAppConstant.getRootUserData();

        if (!adminData) return KtqResponse.toResponse(false);

        if ((await this.findByEmail(adminData.email)) || (await this.findByUsername(adminData.username))) return KtqResponse.toResponse(false);

        const rootRole = KtqRolesConstant.getRoot();

        const admin = new KtqAdminUser();

        admin.username = adminData.username;
        admin.email = adminData.email;
        admin.role = rootRole;
        admin.password_hash = bcrypt.hashSync(adminData.password);

        return KtqResponse.toResponse(!!this.create(admin));
    }

    async findOneWith(options?: FindManyOptions<KtqAdminUser>) {
        return await this.ktqAdminUserRepository.findOne(options);
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqAdminUser> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            username: [FilterOperator.ILIKE],
            email: [FilterOperator.ILIKE],
            last_name: [FilterOperator.ILIKE],
            first_name: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        const data = await paginate(query, this.ktqAdminUserRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['id', 'last_name', 'last_name', 'username', 'email'],
            defaultSortBy: [['id', 'DESC']],
            filterableColumns,
            maxLimit: 100,
            relations: {
                role: true,
            },
        });

        return KtqResponse.toPagination<KtqAdminUser>(data, true, KtqAdminUser);
    }

    async getById(id: KtqAdminUser['id']) {
        const adminUser = await this.findOne(id);

        if (!adminUser) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Not found data`, status_code: HttpStatusCode.NotFound }));

        const responseData = plainToClass(KtqAdminUser, adminUser);

        return KtqResponse.toResponse(responseData);
    }

    async getUseTimePassword(tokenData: TTokenData) {
        const isUseTimePassword = await this.ktqCacheService.getCache(adminUserRoutes.cacheKeyUseTimePassword(tokenData.id));

        return KtqResponse.toResponse({
            use_time: !!isUseTimePassword,
        });
    }

    async updateAdminUser(admin_user_id: KtqAdminUser['id'], { admin_password, use_time, ...data }: UpdateKtqAdminUserDto) {
        const result = await this.update(admin_user_id, data);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't update now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.byAdminUser(admin_user_id));
        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async changePassword(id: KtqAdminUser['id'], data: ChangePasswordKtqAdminUserDto) {
        if (data.password.trim() === data.new_password.trim()) {
            throw new BadRequestException(
                KtqResponse.toResponse(null, {
                    message: 'New password must be different from old password',
                    status_code: HttpStatusCode.BadRequest,
                }),
            );
        }

        const admin = await this.findOne(id);

        if (!admin) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Account not found on system', status_code: HttpStatusCode.NotFound }));

        const is_match_password = await bcrypt.compare(data.password, admin.password_hash);

        if (!is_match_password) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Password is not match', status_code: HttpStatusCode.BadRequest }));

        // all good
        admin.password_hash = bcrypt.hashSync(data.new_password);

        const result = await this.update(admin.id, admin);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Password update failure', status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async setNewPassword(id: KtqAdminUser['id'], data: SetNewPasswordKtqAdminUserDto) {
        const admin = await this.findOne(id);

        if (!admin) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Account not found on system', status_code: HttpStatusCode.NotFound }));

        // all good
        admin.password_hash = bcrypt.hashSync(data.new_password);

        const result = await this.update(admin.id, admin);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Password update failure', status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async inActive(id: KtqAdminUser['id']) {
        const adminUser = await this.findOne(id);

        if (!adminUser) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));
        }

        if (adminUser.id === KtqAppConstant.getRootUserData().id)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: "Account can't action", status_code: HttpStatusCode.BadRequest }));

        const result = await this.update(adminUser.id, { is_active: false });

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());
        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async inActives(ids: KtqAdminUser['id'][]) {
        const newIds = ids.filter((id) => id !== KtqAppConstant.getRootUserData().id);

        const result = await this.ktqAdminUserRepository.update(newIds, { is_active: false });

        if (!result?.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());
        return KtqResponse.toResponse(true);
    }

    async active(id: KtqAdminUser['id']) {
        const adminUser = await this.findOne(id);

        if (!adminUser) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));
        }

        if (adminUser.id === KtqAppConstant.getRootUserData().id)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: "Account can't action", status_code: HttpStatusCode.BadRequest }));

        const result = await this.update(adminUser.id, { is_active: true });

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());
        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async actives(ids: KtqAdminUser['id'][]) {
        const newIds = ids.filter((id) => id !== KtqAppConstant.getRootUserData().id);

        const result = await this.ktqAdminUserRepository.update({ id: In(newIds) }, { is_active: true });

        if (!result?.affected) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: 'Update failure', status_code: HttpStatusCode.BadRequest }));
        }

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());
        return KtqResponse.toResponse(true);
    }

    async deletes(ids: KtqAdminUser['id'][]) {
        const newIds = ids.filter((id) => id !== KtqAppConstant.getRootUserData().id);

        const result = await this.ktqAdminUserRepository.delete(newIds);

        const resultSessions = await this.ktqSessionService.deleteByAdminUserIds(newIds);

        if (!result || !resultSessions) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't delete with data`, status_code: HttpStatusCode.BadRequest }));

        if (!result.affected) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Can't found data`, status_code: HttpStatusCode.NotFound }));

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());
        return KtqResponse.toResponse(true, { message: `Delete success ${result.affected} items` });
    }

    async deleteAdminUser(id: KtqAdminUser['id']) {
        const adminUser = await this.findOne(id);

        if (!adminUser) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));

        if (adminUser.id === KtqAppConstant.getRootUserData().id)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: "Account can't action", status_code: HttpStatusCode.BadRequest }));

        await this.delete(adminUser.id);

        await this.ktqSessionService.deleteByAdminUserIds([id]);

        this.ktqCacheService.clearKeysByPrefix(adminUserRoutes.key());

        return KtqResponse.toResponse(true);
    }

    async createNewAdminUser({ password, admin_password, use_time, ...data }: CreateKtqAdminUserDto) {
        const password_hash = bcrypt.hashSync(password);

        const adminUser = await this.create({ ...data, password_hash, role: KtqRolesConstant.getNormalAdmin() });

        if (!adminUser) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't create new admin user`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, adminUser));
    }
}
