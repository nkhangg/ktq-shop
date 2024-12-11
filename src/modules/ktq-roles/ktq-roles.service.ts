//import GeneralKtqRoleDto from "@/common/dtos/ktq-roles.dto";
import GeneralKtqRoleDto from '@/common/dtos/ktq-roles.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqRole from '@/entities/ktq-roles.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/ktq-caches.service';
import { roleRoutes } from './ktq-role.route';

@Injectable()
export class KtqRolesService implements ServiceInterface<KtqRole, Partial<KtqRole>> {
    constructor(
        @InjectRepository(KtqRole)
        private readonly ktqRoleRepository: Repository<KtqRole>,
        private readonly ktqCacheService: KtqCachesService,
    ) {}

    async create(role: Partial<KtqRole>): Promise<KtqRole> {
        const ktqRole = this.ktqRoleRepository.create(role);
        return this.ktqRoleRepository.save(ktqRole);
    }

    async findAll(): Promise<KtqRole[]> {
        return this.ktqRoleRepository.find();
    }

    async findOne(id: KtqRole['id']): Promise<KtqRole> {
        return this.ktqRoleRepository.findOneBy({ id });
    }

    async update(id: KtqRole['id'], role: Partial<KtqRole>): Promise<KtqRole> {
        await this.ktqRoleRepository.update({ id }, role);
        return this.findOne(id);
    }

    async delete(id: KtqRole['id']): Promise<void> {
        await this.ktqRoleRepository.delete(id);
    }

    async initRoles() {
        return await this.ktqRoleRepository.save(KtqRolesConstant.getRoles());
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqRole> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            created_at: true,
            updated_at: true,
        };

        const data = await paginate(query, this.ktqRoleRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['id', 'role_name'],
            defaultSortBy: [['id', 'ASC']],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqRole>(data, true, KtqRole);
    }

    async updateRole(id: KtqRole['id'], data: GeneralKtqRoleDto) {
        const role = await this.findOne(id);

        if (!role) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatusCode.NotFound }));

        const result = await this.update(id, data);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't update now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(roleRoutes.key());
        return KtqResponse.toResponse(result);
    }

    async createRole(data: GeneralKtqRoleDto) {
        const result = await this.create(data);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't create now`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefix(roleRoutes.key());

        return KtqResponse.toResponse(result);
    }

    async deleteRole(id: KtqRole['id']) {
        try {
            await this.delete(id);

            await this.ktqCacheService.clearKeysByPrefix(roleRoutes.key());
            return KtqResponse.toResponse(true);
        } catch (error) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: `Can't delete this role`, status_code: HttpStatusCode.BadRequest }));
        }
    }
}
