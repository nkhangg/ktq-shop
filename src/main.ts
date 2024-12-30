import { BadRequestException, RequestMethod, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/systems/filters/bad-request-exception-filter';
import KtqResponse from './common/systems/response/ktq-response';
import KtqConfigConstant from './constants/ktq-configs.constant';
import { DataSource, In } from 'typeorm';
import KtqConfig from './entities/ktq-configs.entity';
import { KtqConfigsService } from './modules/ktq-configs/ktq-configs.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(KtqConfigsService);

    const prefix_version = await configService.getPrefixVersion();

    const cors_sources = await configService.getCorsSources();

    app.enableCors({
        origin: cors_sources,
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: 'Content-Type, Authorization',
        credentials: true,
    });

    app.setGlobalPrefix(prefix_version, {
        exclude: [
            {
                path: 'medias/(.*)',
                method: RequestMethod.ALL,
            },
        ],
    });
    // app.setGlobalPrefix('api/v1');

    app.useGlobalFilters(new BadRequestExceptionFilter());

    app.use(
        helmet({
            crossOriginResourcePolicy: false,
        }),
    );

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            exceptionFactory: (errors) => {
                const customErrors = errors.map((error) => ({
                    field: error.property,
                    errors: Object.values(error.constraints),
                }));

                return new BadRequestException(
                    KtqResponse.toResponse(null, {
                        message: 'Validation pipes failed',
                        status_code: 400,
                        bonus: { errors: customErrors },
                    }),
                );
            },
        }),
    );

    useContainer(app.select(AppModule), { fallbackOnErrors: true });

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
