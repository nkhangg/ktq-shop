import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestExceptionFilter } from './common/systems/filters/bad-request-exception-filter';
import KtqResponse from './common/systems/response/ktq-response';
import KtqConfigConstant from './constants/ktq-configs.constant';
import { useContainer } from 'class-validator';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Cấu hình CORS
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:5173'],
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        allowedHeaders: 'Content-Type, Accept, Authorization',
        credentials: true,
    });

    app.setGlobalPrefix(`${KtqConfigConstant.getApiPrefix().key_value}/${KtqConfigConstant.getApiVersion().key_value}`);
    // app.setGlobalPrefix('api/v1');

    app.useGlobalFilters(new BadRequestExceptionFilter());

    app.use(helmet());

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
