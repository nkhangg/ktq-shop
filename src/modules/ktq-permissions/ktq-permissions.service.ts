//import GeneralKtqPermissionDto from "@/common/dtos/ktq-permissions.dto";
import { AddPermissionForRoleData } from '@/common/dtos/ktq-permissions.dto';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqPermissionsConstant from '@/constants/ktq-permission.constant';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';
import KtqRole from '@/entities/ktq-roles.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FilterOperator, FilterSuffix, paginate, PaginateQuery } from 'nestjs-paginate';
import { Column } from 'nestjs-paginate/lib/helper';
import { FindManyOptions, Repository } from 'typeorm';
import { KtqCachesService } from '../ktq-caches/services/ktq-caches.service';
import { KtqPermissionsRoutes } from './ktq-permissions.route';

@Injectable()
export class KtqPermissionsService implements ServiceInterface<KtqPermission, Partial<KtqPermission>> {
    constructor(
        @InjectRepository(KtqPermission)
        private readonly ktqPermissionRepository: Repository<KtqPermission>,
        @InjectRepository(KtqRolePermission)
        private readonly ktqRolePermissionRepository: Repository<KtqRolePermission>,
        @InjectRepository(KtqRole)
        private readonly ktqRoleRepository: Repository<KtqRole>,
        private ktqCacheService: KtqCachesService,
        private ktqPermissionsRoutes: KtqPermissionsRoutes,
    ) {}

    async create(permission: Partial<KtqPermission>): Promise<KtqPermission> {
        const ktqPermission = this.ktqPermissionRepository.create(permission);
        return this.ktqPermissionRepository.save(ktqPermission);
    }

    async findAll(): Promise<KtqPermission[]> {
        return this.ktqPermissionRepository.find();
    }

    async findOne(id: KtqPermission['id']): Promise<KtqPermission> {
        return this.ktqPermissionRepository.findOneBy({ id });
    }

    async update(id: KtqPermission['id'], permission: Partial<KtqPermission>): Promise<KtqPermission> {
        await this.ktqPermissionRepository.update({ id }, permission);
        return this.findOne(id);
    }

    async delete(id: KtqPermission['id']): Promise<void> {
        await this.ktqPermissionRepository.delete(id);
    }

    async findWith(options?: FindManyOptions<KtqPermission>) {
        return await this.ktqPermissionRepository.find(options);
    }

    async findOneWith(options?: FindManyOptions<KtqPermission>) {
        return await this.ktqPermissionRepository.findOne(options);
    }

    async initPermissions() {
        const permissions = KtqPermissionsConstant.getPermissions();

        const result = await this.ktqPermissionRepository.save(permissions);

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The error when save permission', status_code: HttpStatusCode.BadRequest }));
        }

        return KtqResponse.toResponse(result);
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqPermission> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            created_at: true,
            updated_at: true,
        };

        const data = await paginate(query, this.ktqPermissionRepository, {
            sortableColumns: ['id'],
            filterableColumns,
            searchableColumns: [],
            defaultSortBy: [['id', 'ASC']],
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqPermission>(data, true, KtqPermission);
    }

    async getPermissionByRole(role_id: KtqRole['id']) {
        const result = await this.findWith({
            where: {
                rolePermissions: {
                    role: {
                        id: role_id,
                    },
                },
            },
        });

        return KtqResponse.toResponse(result);
    }

    async clearCacheByRole(role_id: KtqRole['id']) {
        const prefix = await this.ktqPermissionsRoutes.role(role_id);

        await this.ktqCacheService.clearKeysByPrefix(prefix);
    }

    async addPermissionForRole(role_id: KtqRole['id'], data: AddPermissionForRoleData) {
        const rolePermission = await this.ktqRolePermissionRepository.findOne({
            where: {
                permission: {
                    id: data.permission_id,
                },
                role: {
                    id: role_id,
                },
            },
        });

        if (rolePermission) return KtqResponse.toResponse(rolePermission);

        const role = await this.ktqRoleRepository.findOne({ where: { id: role_id } });

        const result = await this.ktqRolePermissionRepository.save({
            permission: this.ktqPermissionRepository.create({ id: data.permission_id }),
            role,
        });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Fail to add permission for role`, status_code: HttpStatusCode.BadRequest }));

        this.clearCacheByRole(role_id);
        return KtqResponse.toResponse(result);
    }

    async removePermissionFormRole(role_id: KtqRole['id'], { permission_id }: AddPermissionForRoleData) {
        const result = await this.ktqRolePermissionRepository.delete({
            role: {
                id: role_id,
            },
            permission: {
                id: permission_id,
            },
        });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(false));

        this.clearCacheByRole(role_id);

        return KtqResponse.toResponse(true);
    }
}
