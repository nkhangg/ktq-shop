//import GeneralKtqCustomerDto from "@/common/dtos/ktq-customers.dto";
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqCustomer from '@/entities/ktq-customers.entity';
import * as bcrypt from 'bcryptjs';
import { ServiceInterface } from '@/services/service-interface';
import { ServiceUserAuthInterface } from '@/services/service-user-auth-interface';
import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';
import { FilterOperator, FilterSuffix, paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Repository } from 'typeorm';
import { HttpStatusCode } from 'axios';
import GeneralKtqCustomerDto from '@/common/dtos/ktq-customers.dto';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';
import { Column } from 'nestjs-paginate/lib/helper';

@Injectable()
export class KtqCustomersService implements ServiceInterface<KtqCustomer, Partial<KtqCustomer>>, ServiceUserAuthInterface<KtqCustomer> {
    constructor(
        @InjectRepository(KtqCustomer)
        private readonly ktqCustomerRepository: Repository<KtqCustomer>,
        private readonly ktqSessionService: KtqSessionsService,
    ) {}

    async create(customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        const ktqCustomer = this.ktqCustomerRepository.create(customer);
        return this.ktqCustomerRepository.save(ktqCustomer);
    }

    async findAll(): Promise<KtqCustomer[]> {
        return this.ktqCustomerRepository.find();
    }

    async findOne(id: KtqCustomer['id']): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ id });
    }

    async update(id: KtqCustomer['id'], customer: Partial<KtqCustomer>): Promise<KtqCustomer> {
        await this.ktqCustomerRepository.update({ id }, customer);
        return this.findOne(id);
    }

    async delete(id: KtqCustomer['id']): Promise<void> {
        await this.ktqCustomerRepository.delete(id);
    }

    async findByEmail(email: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ email });
    }

    async findByUsername(username: string): Promise<KtqCustomer> {
        return this.ktqCustomerRepository.findOneBy({ username });
    }

    async getById(id: KtqCustomer['id']) {
        const customer = await this.findOne(id);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'Not found data', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, customer));
    }

    async getAll(query: PaginateQuery) {
        const filterableColumns: {
            [key in Column<KtqCustomer> | (string & {})]?: (FilterOperator | FilterSuffix)[] | true;
        } = {
            id: true,
            username: [FilterOperator.ILIKE],
            email: [FilterOperator.ILIKE],
            created_at: true,
            updated_at: true,
        };

        query.filter = KtqResponse.processFilters(query.filter, filterableColumns);

        const data = await paginate(query, this.ktqCustomerRepository, {
            sortableColumns: ['id', 'username', 'email', 'created_at', 'updated_at'],
            searchableColumns: ['username', 'email'],
            filterableColumns,
            maxLimit: 100,
        });

        return KtqResponse.toPagination<KtqCustomer>(data, true, KtqCustomer);
    }

    async deletes(ids: KtqCustomer['id'][]) {
        const result = await this.ktqCustomerRepository.delete(ids);

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `Can't delete with data`, status_code: HttpStatusCode.BadRequest }));

        if (!result.affected) throw new NotFoundException(KtqResponse.toResponse(null, { message: `Can't found data`, status_code: HttpStatusCode.NotFound }));

        return KtqResponse.toResponse(true, { message: `Delete success ${result.affected} items` });
    }

    async updateById(id: KtqCustomer['id'], data: GeneralKtqCustomerDto) {
        const customer = await this.findOne(id);
        let logouts = null;
        let newDataCustomer = null;

        if (!customer) throw new NotFoundException('The customer is not found');

        if (data?.password && !bcrypt.compareSync(data.password, customer.password)) {
            const new_hash_pass = bcrypt.hashSync(data.password);

            newDataCustomer = { ...customer, ...data, password: new_hash_pass };

            console.log(newDataCustomer);

            logouts = this.ktqSessionService.logoutByCustomer(customer);

            if (!logouts) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The session not cleared`, status_code: HttpStatusCode.BadRequest }));
        } else {
            newDataCustomer = { ...customer, ...data };
        }

        const result = await this.update(id, newDataCustomer);

        if (!result)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: `The error when update ${customer?.username}`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, result), { message: logouts ? `This customer password changed. Please re-login to use` : 'Update success' });
    }
}
