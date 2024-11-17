//import GeneralKtqUserForgotPasswordDto from "@/common/dtos/ktq-user-forgot-passwords.dto";
import KtqUserForgotPassword from "@/entities/ktq-user-forgot-passwords.entity";

import { ServiceInterface } from "@/services/service-interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, FindManyOptions } from "typeorm";

@Injectable()
export class KtqUserForgotPasswordsService
  implements
    ServiceInterface<KtqUserForgotPassword, Partial<KtqUserForgotPassword>>
{
  constructor(
    @InjectRepository(KtqUserForgotPassword)
    private readonly ktqUserForgotPasswordRepository: Repository<KtqUserForgotPassword>,
  ) {}

  async create(
    userForgotPassword: Partial<KtqUserForgotPassword>,
  ): Promise<KtqUserForgotPassword> {
    const ktqUserForgotPassword =
      this.ktqUserForgotPasswordRepository.create(userForgotPassword);
    return this.ktqUserForgotPasswordRepository.save(ktqUserForgotPassword);
  }

  async findAll(): Promise<KtqUserForgotPassword[]> {
    return this.ktqUserForgotPasswordRepository.find();
  }

  async findOne(
    id: KtqUserForgotPassword["id"],
  ): Promise<KtqUserForgotPassword> {
    return this.ktqUserForgotPasswordRepository.findOneBy({ id });
  }

  async update(
    id: KtqUserForgotPassword["id"],
    userForgotPassword: Partial<KtqUserForgotPassword>,
  ): Promise<KtqUserForgotPassword> {
    await this.ktqUserForgotPasswordRepository.update(
      { id },
      userForgotPassword,
    );
    return this.findOne(id);
  }

  async delete(id: KtqUserForgotPassword["id"]): Promise<void> {
    await this.ktqUserForgotPasswordRepository.delete(id);
  }

  async findWith(options?: FindManyOptions<KtqUserForgotPassword>) {
    return await this.ktqUserForgotPasswordRepository.find(options);
  }

  async findOneWith(options?: FindManyOptions<KtqUserForgotPassword>) {
    return await this.ktqUserForgotPasswordRepository.findOne(options);
  }
}
