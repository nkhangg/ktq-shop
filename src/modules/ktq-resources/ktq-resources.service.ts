//import GeneralKtqResourceDto from "@/common/dtos/ktq-resources.dto";
import KtqResource from '@/entities/ktq-resources.entity';
import e, { Request } from 'express';
import { ServiceInterface } from '@/services/service-interface';
import { BadRequestException, Injectable, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { KtqAppConfigsService } from '../ktq-app-configs/ktq-app-configs.service';
import KtqResponse from '@/common/systems/response/ktq-response';
import { HttpStatusCode } from 'axios';
import { TypeResource } from '@/common/enums/type-resource.enum';
import { paginate, PaginateQuery } from 'nestjs-paginate';
import { excludeResource } from '@/common/routes/exclude-route';
import { RouteInfo } from '@nestjs/common/interfaces';
import KtqPermissionsConstant from '@/constants/ktq-permission.constant';

@Injectable()
export class KtqResourcesService implements ServiceInterface<KtqResource, Partial<KtqResource>> {
    constructor(
        @InjectRepository(KtqResource)
        private readonly ktqResourceRepository: Repository<KtqResource>,
        private readonly ktqAppConfigService: KtqAppConfigsService,
        private readonly dataSource: DataSource,
    ) {}

    async create(resource: Partial<KtqResource>): Promise<KtqResource> {
        const ktqResource = this.ktqResourceRepository.create(resource);
        return this.ktqResourceRepository.save(ktqResource);
    }

    async findAll(): Promise<KtqResource[]> {
        return this.ktqResourceRepository.find();
    }

    async findOne(id: KtqResource['id']): Promise<KtqResource> {
        return this.ktqResourceRepository.findOneBy({ id });
    }

    async update(id: KtqResource['id'], resource: Partial<KtqResource>): Promise<KtqResource> {
        await this.ktqResourceRepository.update({ id }, resource);
        return this.findOne(id);
    }

    async delete(id: KtqResource['id']): Promise<void> {
        await this.ktqResourceRepository.delete(id);
    }

    async getAll(query: PaginateQuery) {
        const data = await paginate(query, this.ktqResourceRepository, {
            sortableColumns: ['id'],
            searchableColumns: [],
            defaultSortBy: [['id', 'DESC']],
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqResource>(data, true, KtqResource);
    }

    async clearDataAndResetId() {
        try {
            await this.dataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);

            await this.ktqResourceRepository.clear();

            await this.dataSource.query(`ALTER TABLE ktq_resources AUTO_INCREMENT = 1`);

            await this.dataSource.query(`SET FOREIGN_KEY_CHECKS = 0`);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async importResources(@Req() request: Request) {
        const routers = this.ktqAppConfigService.getRoutes(request);

        const excludeRules = ['init-', 'import-'];

        if (!routers) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The resource can't get`, status_code: HttpStatusCode.BadRequest }));

        let resources = routers.map((router) => {
            return {
                type_resource: TypeResource.API,
                resource_name: `[${router.method}] ${router.name}`,
                description: null,
                resource_method: router.method,
                resource_code: router.path,
            } as KtqResource;
        });

        resources = resources.filter((item) => !excludeRules.some((i) => item.resource_name.includes(i)));

        // resources = resources.filter((item) => {
        //     return !excludeRoute.some((i) => {
        //         let path = '';

        //         if (typeof i === 'string') {
        //             path = i;
        //         } else {
        //             path = i.path;
        //         }

        //         return item.resource_code === `/${path}` && (typeof i !== 'string' ? i.method === KtqPermissionsConstant.convertToRequestMethod(item.resource_method) : true);
        //     });
        // });

        resources = resources.filter((item) => {
            return !excludeResource.some((i) => {
                let path = '';

                if (typeof i === 'string') {
                    path = i;
                } else {
                    path = i.path;
                }

                return item.resource_code.includes(path) && (typeof i !== 'string' ? i.method === KtqPermissionsConstant.convertToRequestMethod(item.resource_method) : true);
            });
        });

        const clearedResult = await this.clearDataAndResetId();

        if (!clearedResult) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The resource can't ready to save` }));

        const result = await this.ktqResourceRepository.save(resources);

        if (!result) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `The resource can't save`, status_code: HttpStatusCode.BadRequest }));
        }

        return KtqResponse.toResponse(result);
    }
}
