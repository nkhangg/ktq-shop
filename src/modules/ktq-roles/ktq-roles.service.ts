//import GeneralKtqRoleDto from "@/common/dtos/ktq-roles.dto";
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqRole from '@/entities/ktq-roles.entity';

import { ServiceInterface } from '@/services/service-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class KtqRolesService implements ServiceInterface<KtqRole, Partial<KtqRole>> {
    constructor(
        @InjectRepository(KtqRole)
        private readonly ktqRoleRepository: Repository<KtqRole>,
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
}
