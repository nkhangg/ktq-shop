import { Controller, Post } from '@nestjs/common';
import { KtqProvincesService } from '../ktq-provinces.service';

@Controller('admin/provinces')
export class KtqProvincesController {
    constructor(private readonly ktqProvincesService: KtqProvincesService) {}

    @Post('sync')
    async syncData() {
        return await this.ktqProvincesService.syncToDb();
    }
}
