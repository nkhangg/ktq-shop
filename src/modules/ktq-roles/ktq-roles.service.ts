//import GeneralKtqRoleDto from "@/common/dtos/ktq-roles.dto";
import GeneralKtqRoleDto, { AddResourceForRoleKtqRoleDto, DeleteResourceForRoleKtqRoleDto } from '@/common/dtos/ktq-roles.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqRole from '@/entities/ktq-roles.entity';

import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqResource from '@/entities/ktq-resources.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, In, QueryFailedError, Repository } from 'typeorm';
import { KtqAdminUsersService } from '../ktq-admin-users/ktq-admin-users.service';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { roleRoutes } from './ktq-role.route';
import KtqRoleResource from '@/entities/ktq-role-resources.entity';
import { resourcesRoutes } from '../ktq-resources/ktq-resources.route';

@Injectable()
export class KtqRolesService implements ServiceInterface<KtqRole, Partial<KtqRole>> {
    constructor(
        @InjectRepository(KtqRole)
        private readonly ktqRoleRepository: Repository<KtqRole>,
        @InjectRepository(KtqRolePermission)
        private readonly ktqRolePermissionRepository: Repository<KtqRolePermission>,
        @InjectRepository(KtqRoleResource)
        private readonly ktqRoleResourceRepository: Repository<KtqRoleResource>,
        private readonly ktqCacheService: KtqCachesService,
        private readonly ktqAdminUserService: KtqAdminUsersService,
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

    async findWith(options?: FindManyOptions<KtqRole>) {
        return await this.ktqRoleRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqRole>) {
        return await this.ktqRoleRepository.findOne(options);
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

    async getRoleByUserAdmin(id: KtqAdminUser['id']) {
        const rolesData = await this.ktqRoleRepository.findOne({
            where: {
                adminUsers: {
                    id,
                },
            },
            relations: {
                rolePermissions: true,
                roleResources: true,
            },
        });

        return KtqResponse.toResponse(plainToClass(KtqRole, rolesData));
    }

    async addResourceForRole(id: KtqRole['id'], { resource_ids }: AddResourceForRoleKtqRoleDto) {
        const role = await this.findOne(id);

        if (!role) throw new NotFoundException(`Role not found`);

        const roleResources = resource_ids.map((resourceId) => ({
            role,
            resource: { id: resourceId },
        }));

        await this.ktqRoleResourceRepository.save(roleResources);

        await this.ktqCacheService.clearKeysByPrefixes([resourcesRoutes.role(id), resourcesRoutes.ignoreRole(id)]);
        return KtqResponse.toResponse(role);
    }

    async deleteResourcesForRole(role_id: KtqRole['id'], { resource_ids }: DeleteResourceForRoleKtqRoleDto) {
        const result = await this.ktqRoleResourceRepository.delete({
            role: {
                id: role_id,
            },
            resource: {
                id: In(resource_ids),
            },
        });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(false, { message: `Can't delete this role resource`, status_code: HttpStatusCode.BadRequest }));

        await this.ktqCacheService.clearKeysByPrefixes([resourcesRoutes.role(role_id), resourcesRoutes.ignoreRole(role_id)]);
        return KtqResponse.toResponse(true);
    }
}
