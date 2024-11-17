//import GeneralKtqResourcePermissionDto from "@/common/dtos/ktq-resource-permissions.dto";
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqPermission from '@/entities/ktq-permissions.entity';
import KtqResourcePermission from '@/entities/ktq-resource-permissions.entity';
import KtqResource from '@/entities/ktq-resources.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class KtqResourcePermissionsService implements ServiceInterface<KtqResourcePermission, Partial<KtqResourcePermission>> {
    constructor(
        @InjectRepository(KtqResourcePermission)
        private readonly ktqResourcePermissionRepository: Repository<KtqResourcePermission>,
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
}
