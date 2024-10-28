import GeneralKtqAdminUserDto from '@/common/dtos/ktq-admin-users.dto';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';

import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    async findOne(id: KtqAdminUser['id']): Promise<KtqAdminUser> {
        return this.ktqAdminUserRepository.findOneBy({ id });
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
}
