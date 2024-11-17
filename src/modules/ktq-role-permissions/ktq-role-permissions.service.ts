//import GeneralKtqRolePermissionDto from "@/common/dtos/ktq-role-permissions.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqRolePermissionConstant from '@/constants/ktq-role-permission.constant';
import KtqRolePermission from '@/entities/ktq-role-permissions.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { Repository } from 'typeorm';

@Injectable()
export class KtqRolePermissionsService implements ServiceInterface<KtqRolePermission, Partial<KtqRolePermission>> {
    constructor(
        @InjectRepository(KtqRolePermission)
        private readonly ktqRolePermissionRepository: Repository<KtqRolePermission>,
    ) {}

    async create(rolePermission: Partial<KtqRolePermission>): Promise<KtqRolePermission> {
        const ktqRolePermission = this.ktqRolePermissionRepository.create(rolePermission);
        return this.ktqRolePermissionRepository.save(ktqRolePermission);
    }

    async findAll(): Promise<KtqRolePermission[]> {
        return this.ktqRolePermissionRepository.find();
    }

    async findOne(id: KtqRolePermission['id']): Promise<KtqRolePermission> {
        return this.ktqRolePermissionRepository.findOneBy({ id });
    }

    async update(id: KtqRolePermission['id'], rolePermission: Partial<KtqRolePermission>): Promise<KtqRolePermission> {
        await this.ktqRolePermissionRepository.update({ id }, rolePermission);
        return this.findOne(id);
    }

    async delete(id: KtqRolePermission['id']): Promise<void> {
        await this.ktqRolePermissionRepository.delete(id);
    }

    async initRolePermission() {
        const rolePermissions = KtqRolePermissionConstant.getRolePermissions();

        const result = await this.ktqRolePermissionRepository.save(rolePermissions);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The role_permission don't ready to save`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(result);
    }
}
