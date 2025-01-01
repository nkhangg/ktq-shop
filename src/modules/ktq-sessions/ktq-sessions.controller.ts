import { SessionLogoutDto, SessionLogoutsDto } from '@/common/dtos/ktq-sessions.dto';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { KtqSessionsService } from './ktq-sessions.service';
import { TokenData, TTokenData } from '@/common/decorators/token-data.decorator';
import { KtqSessionsRoutes } from './ktq-sessions.route';

@Controller(KtqSessionsRoutes.BASE)
export class KtqSessionsController {
    constructor(private ktqSession: KtqSessionsService) {}

    @Get('customer/online')
    public async getCustomerOnline(@Paginate() query: PaginateQuery) {
        return await this.ktqSession.getCustomersOnline(query);
    }

    @Get('customer/:id')
    public async getAllByCustomer(@Param('id') id: KtqCustomer['id'], @Paginate() query: PaginateQuery) {
        return await this.ktqSession.getSessionsByCustomer(id, query);
    }

    @Get('me')
    public async getCurrentSession(@TokenData() tokendata: TTokenData, @Paginate() query: PaginateQuery) {
        return await this.ktqSession.getSessionsByAdmin(tokendata.id, query);
    }

    @Put('customer/logout/:id')
    public async logoutCustomer(@Param('id') user_id: KtqCustomer['id'], @Body() { id_session }: SessionLogoutDto) {
        console.log({ user_id, id_session });
        return await this.ktqSession.logoutCustomer({ user_id, id_session });
    }

    @Put('customer/logouts/:id')
    public async logoutsCustomer(@Param('id') user_id: KtqCustomer['id'], @Body() { ids_session }: SessionLogoutsDto) {
        return await this.ktqSession.logoutsCustomer({ user_id, ids_session });
    }
}
