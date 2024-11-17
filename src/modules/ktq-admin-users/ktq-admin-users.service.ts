import * as bcrypt from 'bcryptjs';
import GeneralKtqAdminUserDto from '@/common/dtos/ktq-admin-users.dto';
import KtqAppConstant from '@/constants/ktq-app.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqResponse from '@/common/systems/response/ktq-response';
import { paginate, PaginateQuery } from 'nestjs-paginate';

@Injectable()
export class KtqAdminUsersService implements ServiceInterface<KtqAdminUser, Partial<KtqAdminUser>>, ServiceUserAuthInterface<KtqAdminUser> {
    constructor(
        @InjectRepository(KtqAdminUser)
        private readonly ktqAdminUserRepository: Repository<KtqAdminUser>,
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
        return await this.ktqAdminUserRepository.findOne({ where: { username } });
    }

    async findByEmail(email: string): Promise<KtqAdminUser> {
        return await this.ktqAdminUserRepository.findOne({ where: { email } });
    }

    async findByUsernameAndEmail(username: string, email: string) {
        return await this.ktqAdminUserRepository.findOne({ where: { email, username } });
    }
    async findRootAdmin() {
        const { email, username } = KtqAppConstant.getRootUserData();

        return await this.findByUsernameAndEmail(username, email);
    }

    async initRootAdmin() {
        const adminData = KtqAppConstant.getRootUserData();

        if (!adminData) return KtqResponse.toResponse(false);

        if ((await this.findByEmail(adminData.email)) || (await this.findByUsername(adminData.username))) return KtqResponse.toResponse(false);

        const rootRole = KtqRolesConstant.getSuperAdmin();

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
        const data = await paginate(query, this.ktqAdminUserRepository, {
            sortableColumns: ['id'],
            searchableColumns: [],
            defaultSortBy: [['id', 'DESC']],
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqAdminUser>(data, true, KtqAdminUser);
    }
}
