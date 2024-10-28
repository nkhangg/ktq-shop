import { TypeOrmModule } from '@nestjs/typeorm';
import KtqRole from '@/entities/ktq-roles.entity';
import { Module } from '@nestjs/common';
import { KtqRolesService } from './ktq-roles.service';
import { KtqRolesController } from './ktq-roles.controller';

@Module({
    imports: [TypeOrmModule.forFeature([KtqRole])],
    providers: [KtqRolesService],
    controllers: [KtqRolesController],
    exports: [KtqRolesService],
})
export class KtqRolesModule {}
