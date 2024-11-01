import { TypeOrmModule } from '@nestjs/typeorm';
import KtqCustomer from '@/entities/ktq-customers.entity';
import { Module } from '@nestjs/common';
import { KtqCustomersService } from './ktq-customers.service';
import { KtqCustomersController } from './ktq-customers.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqCustomer])],
    providers: [KtqCustomersService],
    exports: [KtqCustomersService],
    controllers: [KtqCustomersController],
})
export class KtqCustomersModule {}
