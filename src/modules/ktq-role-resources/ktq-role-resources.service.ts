//import GeneralKtqRoleResourceDto from "@/common/dtos/ktq-role-resources.dto";
import KtqRoleResource from '@/entities/ktq-role-resources.entity';

import KtqResponse from '@/common/systems/response/ktq-response';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { Repository } from 'typeorm';
import { KtqResourcesService } from '../ktq-resources/ktq-resources.service';
import GeneralKtqRoleResourceDto, { GrantPermission } from '@/common/dtos/ktq-role-resources.dto';
import { KtqResourcePermissionsService } from '../ktq-resource-permissions/ktq-resource-permissions.service';
import { TTokenData } from '@/common/decorators/token-data.decorator';
import { KtqPermissionsService } from '../ktq-permissions/ktq-permissions.service';
import KtqPermissionsConstant from '@/constants/ktq-permission.constant';

@Injectable()
export class KtqRoleResourcesService implements ServiceInterface<KtqRoleResource, Partial<KtqRoleResource>> {
    constructor(
        @InjectRepository(KtqRoleResource)
        private readonly ktqRoleResourceRepository: Repository<KtqRoleResource>,
        private readonly ktqResourceService: KtqResourcesService,
        private readonly ktqPermissionsService: KtqPermissionsService,
        private readonly ktqResourcePermissionsService: KtqResourcePermissionsService,
    ) {}

    async create(roleResource: Partial<KtqRoleResource>): Promise<KtqRoleResource> {
        const ktqRoleResource = this.ktqRoleResourceRepository.create(roleResource);
        return this.ktqRoleResourceRepository.save(ktqRoleResource);
    }

    async findAll(): Promise<KtqRoleResource[]> {
        return this.ktqRoleResourceRepository.find();
    }

    async findOne(id: KtqRoleResource['id']): Promise<KtqRoleResource> {
        return this.ktqRoleResourceRepository.findOneBy({ id });
    }

    async update(id: KtqRoleResource['id'], roleResource: Partial<KtqRoleResource>): Promise<KtqRoleResource> {
        await this.ktqRoleResourceRepository.update({ id }, roleResource);
        return this.findOne(id);
    }

    async delete(id: KtqRoleResource['id']): Promise<void> {
        await this.ktqRoleResourceRepository.delete(id);
    }

    async grantPermissions(data: GrantPermission) {
        const exitedData = await this.ktqRoleResourceRepository.findOne({
            where: { resource: { id: data.resource_id }, role: { id: data.role_id } },
        });

        if (exitedData) {
            throw new BadRequestException(
                KtqResponse.toResponse(null, { message: 'Permission (group role) for this resource has granted', status_code: HttpStatusCode.BadRequest }),
            );
        }

        const resource = await this.ktqResourceService.findOne(data.resource_id);

        if (!resource) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The resource not found', status_code: HttpStatusCode.NotFound }));
        }

        const permission = KtqPermissionsConstant.requestMappingRole(KtqPermissionsConstant.convertToRequestMethod(resource.resource_method));

        if (!permission) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The permission not found', status_code: HttpStatusCode.NotFound }));
        }

        const exitedResourcePermission = await this.ktqResourcePermissionsService.exited({ admin_id: data.admin_id, permission_id: permission.id, resource_id: resource.id });

        if (exitedResourcePermission) {
            throw new BadRequestException(
                KtqResponse.toResponse(null, { message: 'Permission (simple permission) for this resource has granted', status_code: HttpStatusCode.BadRequest }),
            );
        }

        const grantPermissionData = await this.ktqRoleResourceRepository.save({ resource, role: { id: data.role_id } });

        if (!grantPermissionData) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `Permission level is not ready`, status_code: HttpStatusCode.BadRequest }));
        }

        return KtqResponse.toResponse(grantPermissionData);
    }

    async initRoleResources() {
        const rootRole = KtqRolesConstant.getSuperAdmin();

        const resources = await this.ktqResourceService.findAll();

        const roleResources = resources.map((resource, index) => {
            return {
                id: index + 1,
                resource,
                role: rootRole,
            } as KtqRoleResource;
        });

        const result = await this.ktqRoleResourceRepository.save(roleResources);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The role_resource don't ready to save`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(result);
    }
}
