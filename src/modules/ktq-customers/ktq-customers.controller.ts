import GeneralKtqCustomerDto, {
    CreateKtqCustomerDto,
    DeleteMediaKtqCustomerDto,
    DeletesKtqCustomerDto,
    HiddenKtqCustomerDto,
    UpdatesKtqCustomerDto,
} from '@/common/dtos/ktq-customers.dto';
import KtqAppConstant from '@/constants/ktq-app.constant';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { filterStorage, storageConfig } from '@/utils/file-store';
import { CacheTTL } from '@nestjs/cache-manager';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Paginate, PaginateQuery } from 'nestjs-paginate';
import { customersRoutes } from './ktq-customers.route';
import { KtqCustomersService } from './ktq-customers.service';
import { KtqAuthenticationsService } from '../ktq-authentications/ktq-authentications.service';
import { RegisterKtqCustomerDto } from '@/common/dtos/ktq-authentication.dto';

@Controller(customersRoutes.BASE)
export class KtqCustomersController {
    constructor(private readonly ktqCustomerService: KtqCustomersService) {}

    @Get('online')
    public async getCustomersOnline(@Paginate() query: PaginateQuery) {
        return await this.ktqCustomerService.getCustomersOnline(query);
    }

    @Get(':id')
    public async getById(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.getById(id);
    }

    @Get('/view/:id')
    @CacheTTL(0)
    public async getCustomerView(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.getCustomerView(id);
    }

    @Post(':id/avatar')
    @UseInterceptors(
        FileInterceptor('avatar', {
            storage: storageConfig(KtqAppConstant.CUSTOMER_MEDIA_PATH),
            fileFilter: filterStorage,
        }),
    )
    async uploadAvatar(@Param('id', ParseIntPipe) id: number, @UploadedFile() avatar: Express.Multer.File) {
        return this.ktqCustomerService.uploadAvatar(id, avatar);
    }

    @Post(':id/bg-cover')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: storageConfig(KtqAppConstant.CUSTOMER_MEDIA_PATH),
            fileFilter: filterStorage,
        }),
    )
    async uploadBgCover(@Param('id', ParseIntPipe) id: number, @UploadedFile() image: Express.Multer.File) {
        return this.ktqCustomerService.uploadBgCover(id, image);
    }

    @Delete(':id/media')
    async deleteMedia(@Param('id', ParseIntPipe) id: number, @Body() data: DeleteMediaKtqCustomerDto) {
        return this.ktqCustomerService.deleteMedia(id, data.attr);
    }

    @Get()
    public async getAll(@Paginate() query: PaginateQuery) {
        return await this.ktqCustomerService.getAll(query);
    }

    @Post('')
    public async create(@Body() data: CreateKtqCustomerDto) {
        return await this.ktqCustomerService.createCustomer(data);
    }

    @Put('multiple')
    public async updates(@Body() data: UpdatesKtqCustomerDto) {
        return await this.ktqCustomerService.updates(data);
    }

    @Put(':id')
    public async update(@Param('id') id: KtqCustomer['id'], @Body() data: GeneralKtqCustomerDto) {
        return await this.ktqCustomerService.updateById(id, data);
    }

    @Put('hidden/multiple')
    public async hiddenCustomers(@Body() { ids }: HiddenKtqCustomerDto) {
        return await this.ktqCustomerService.hiddenCustomers(ids);
    }

    @Put('hidden/:id')
    public async hiddenCustomer(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.hiddenCustomer(id);
    }

    @Put('unhidden/multiple')
    public async unhiddenCustomers(@Body() { ids }: HiddenKtqCustomerDto) {
        return await this.ktqCustomerService.unhiddenCustomers(ids);
    }

    @Put('unhidden/:id')
    public async unhiddenCustomer(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.unhiddenCustomer(id);
    }

    @Delete('multiple')
    public async deletes(@Body() { ids }: DeletesKtqCustomerDto) {
        return await this.ktqCustomerService.deletes(ids);
    }

    @Delete(':id')
    public async delete(@Param('id') id: KtqCustomer['id']) {
        return await this.ktqCustomerService.deleteCustomer(id);
    }
}
