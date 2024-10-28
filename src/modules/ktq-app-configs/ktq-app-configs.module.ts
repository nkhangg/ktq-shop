import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KtqDatabasesModule } from 'src/modules/ktq-databases/ktq-databases.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        KtqDatabasesModule,
    ],
})
export class KtqAppConfigsModule {}
