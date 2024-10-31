//import GeneralKtqWebsiteDto from "@/common/dtos/ktq-websites.dto";
import KtqWebsite from "@/entities/ktq-websites.entity";

import { ServiceInterface } from "@/services/service-interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class KtqWebsitesService
  implements ServiceInterface<KtqWebsite, Partial<KtqWebsite>>
{
  constructor(
    @InjectRepository(KtqWebsite)
    private readonly ktqWebsiteRepository: Repository<KtqWebsite>,
  ) {}

  async create(website: Partial<KtqWebsite>): Promise<KtqWebsite> {
    const ktqWebsite = this.ktqWebsiteRepository.create(website);
    return this.ktqWebsiteRepository.save(ktqWebsite);
  }

  async findAll(): Promise<KtqWebsite[]> {
    return this.ktqWebsiteRepository.find();
  }

  async findOne(id: KtqWebsite["id"]): Promise<KtqWebsite> {
    return this.ktqWebsiteRepository.findOneBy({ id });
  }

  async update(
    id: KtqWebsite["id"],
    website: Partial<KtqWebsite>,
  ): Promise<KtqWebsite> {
    await this.ktqWebsiteRepository.update({ id }, website);
    return this.findOne(id);
  }

  async delete(id: KtqWebsite["id"]): Promise<void> {
    await this.ktqWebsiteRepository.delete(id);
  }
}
