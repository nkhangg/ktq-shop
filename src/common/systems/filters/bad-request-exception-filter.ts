import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import KtqResponse from '../response/ktq-response';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        const jsonException = JSON.stringify(exception.getResponse());

        if (jsonException.includes('status_code') || jsonException.includes('Validation pipes failed')) {
            response.status(status).json(exception.getResponse());
        } else {
            response.status(status).json(
                KtqResponse.toResponse(null, {
                    message: exception.getResponse()['message'] ?? '',
                    status_code: status,
                    bonus: { errors: exception.getResponse()['error'] },
                }),
            );
        }
    }
}
