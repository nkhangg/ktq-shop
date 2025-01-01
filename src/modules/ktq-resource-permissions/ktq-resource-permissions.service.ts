//import GeneralKtqResourcePermissionDto from "@/common/dtos/ktq-resource-permissions.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqResource from '@/entities/ktq-resources.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { CreateResourcePermission } from '@/common/dtos/ktq-resource-permissions.dto';
import { plainToClass } from 'class-transformer';
import { HttpStatusCode } from 'axios';
import { KtqResourcePermissionsRoutes } from './ktq-resource-permissions.route';

@Injectable()
export class KtqResourcePermissionsService implements ServiceInterface<KtqResourcePermission, Partial<KtqResourcePermission>> {
    constructor(
        @InjectRepository(KtqResourcePermission)
        private readonly ktqResourcePermissionRepository: Repository<KtqResourcePermission>,
        private readonly ktqCacheService: KtqCachesService,
        private readonly ktqResourcePermissionsRoutes: KtqResourcePermissionsRoutes,
    ) {}

    async create(resourcePermission: Partial<KtqResourcePermission>): Promise<KtqResourcePermission> {
        const ktqResourcePermission = this.ktqResourcePermissionRepository.create(resourcePermission);
        return this.ktqResourcePermissionRepository.save(ktqResourcePermission);
    }

    async findAll(): Promise<KtqResourcePermission[]> {
        return this.ktqResourcePermissionRepository.find();
    }

    async findOne(id: KtqResourcePermission['id']): Promise<KtqResourcePermission> {
        return this.ktqResourcePermissionRepository.findOneBy({ id });
    }

    async update(id: KtqResourcePermission['id'], resourcePermission: Partial<KtqResourcePermission>): Promise<KtqResourcePermission> {
        await this.ktqResourcePermissionRepository.update({ id }, resourcePermission);
        return this.findOne(id);
    }

    async delete(id: KtqResourcePermission['id']): Promise<void> {
        await this.ktqResourcePermissionRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqResourcePermission>) {
        return await this.ktqResourcePermissionRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqResourcePermission>) {
        return await this.ktqResourcePermissionRepository.findOne(options);
    }

    async exited(data: { admin_id: KtqAdminUser['id']; resource_id: KtqResource['id']; permission_id: KtqPermission['id'] }) {
        return await this.ktqResourcePermissionRepository.findOne({
            where: {
                adminUser: { id: data.admin_id },
                permission: { id: data.permission_id },
                resource: { id: data.resource_id },
            },
        });
    }

    async getAll(resource_id: KtqResource['id'], query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqResource> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            'resourcePermissions.adminUser.username)': true,
            'resourcePermissions.adminUser.email)': true,
            'resourcePermissions.adminUser.is_active)': true,
            'resourcePermissions.adminUser.role)': true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqResourcePermissionRepository, {
            sortableColumns: ['id'],
            searchableColumns: ['id'],
            defaultLimit: 10,
            filterableColumns,
            defaultSortBy: [['id', 'DESC']],
            maxLimit: 100,
            where: {
                resource: { id: resource_id },
            },
            relations: {
                adminUser: {
                    role: true,
                },
                permission: true,
                resource: true,
            },
        });

        return KtqResponse.toPagination<KtqResourcePermission>(data, true, KtqResourcePermission);
    }

    async clearCacheByResource(resource_id: KtqResource['id']) {
        const prefix = await this.ktqResourcePermissionsRoutes.resource(resource_id);

        await this.ktqCacheService.clearKeysByPrefix(prefix);
    }

    async createResourcePermission({ admin_user_id, permission_id, resource_id }: CreateResourcePermission) {
        try {
            const resourcePermission = await this.ktqResourcePermissionRepository.save({
                adminUser: { id: admin_user_id },
                permission: { id: permission_id },
                resource: { id: resource_id },
            });

            if (!resourcePermission) {
                throw new BadRequestException(KtqResponse.toResponse(null, { message: `The resource permission can't create`, status_code: HttpStatusCode.BadRequest }));
            }

            this.clearCacheByResource(resource_id);
            return KtqResponse.toResponse(plainToClass(KtqResourcePermission, resourcePermission), { message: `The resource permission has been created` });
        } catch (error) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: `The resource permission existed`, status_code: HttpStatusCode.NotFound }));
        }
    }

    async deleteResourcePermission(id: KtqResourcePermission['id'], resource_id: KtqResource['id']) {
        const result = await this.ktqResourcePermissionRepository.delete(id);

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(false, { message: `Can't delete this resource permission`, status_code: HttpStatusCode.BadRequest }));
        }

        this.clearCacheByResource(resource_id);
        return KtqResponse.toResponse(true, { message: `The resource permission has been deleted` });
    }
}
