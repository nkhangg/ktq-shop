//import GeneralKtqPermissionDto from "@/common/dtos/ktq-permissions.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqPermissionsConstant from '@/constants/ktq-permission.constant';
import KtqPermission from '@/entities/ktq-permissions.entity';

import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class KtqPermissionsService implements ServiceInterface<KtqPermission, Partial<KtqPermission>> {
    constructor(
        @InjectRepository(KtqPermission)
        private readonly ktqPermissionRepository: Repository<KtqPermission>,
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
}
