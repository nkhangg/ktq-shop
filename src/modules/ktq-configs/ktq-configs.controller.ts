import { Controller, Get } from '@nestjs/common';
import { KtqConfigsService } from './ktq-configs.service';

@Controller('ktq-configs')
export class KtqConfigsController {
  constructor(private readonly ktqConfigService: KtqConfigsService) {}

  @Get()
  findAll(): Object {
    return this.ktqConfigService.findAll();
  }
}
