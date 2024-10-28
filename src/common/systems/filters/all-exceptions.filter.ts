import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : 500; // Mặc định là 500 nếu không phải HttpException

        console.log(exception);
        const errorResponse = {
            status_code: status,
            message:
                exception instanceof HttpException
                    ? typeof exception.getResponse() === 'string'
                        ? exception.getResponse()
                        : exception.getResponse()['message']
                    : 'Internal Server Error',
            error: exception instanceof HttpException ? exception.name : 'Internal Error',
        };

        response.status(status).json(errorResponse);
    }
}
