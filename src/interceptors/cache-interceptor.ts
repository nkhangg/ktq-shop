import { CacheInterceptor as CI } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CacheInterceptor extends CI {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const path = request.url;

        const endsWith = ['events', 'events-sse'];

        if (path.startsWith('/medias') || endsWith.some((suffix) => (path as string).includes(suffix))) {
            return undefined;
        }

        return super.trackBy(context);
    }
}
