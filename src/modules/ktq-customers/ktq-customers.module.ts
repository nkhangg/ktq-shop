import KtqCustomer from '@/entities/ktq-customers.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KtqSessionsModule } from '../ktq-sessions/ktq-sessions.module';
import { KtqCustomersController } from './ktq-customers.controller';
import { KtqCustomersService } from './ktq-customers.service';

@Module({
    imports: [TypeOrmModule.forFeature([KtqCustomer]), KtqSessionsModule],
    providers: [KtqCustomersService],
    exports: [KtqCustomersService],
    controllers: [KtqCustomersController],
})
export class KtqCustomersModule {}
