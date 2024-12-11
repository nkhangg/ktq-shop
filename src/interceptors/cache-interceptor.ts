import { CacheInterceptor as CI } from '@nestjs/cache-manager';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class CacheInterceptor extends CI {
    trackBy(context: ExecutionContext): string | undefined {
        const request = context.switchToHttp().getRequest();
        const path = request.url;

        if (path.startsWith('/medias')) {
            return undefined;
        }

        return super.trackBy(context);
    }
}
