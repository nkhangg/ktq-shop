import KtqConfigConstant from '@/constants/ktq-configs.constant';
import { Injectable } from '@nestjs/common';
import { Request, Router } from 'express';

@Injectable()
export class KtqAppConfigsService {
    constructor() {}

    getRoutes(request: Request) {
        const router = request.app._router as Router;

        const routes = router.stack
            .map((layer) => {
                if (layer.route) {
                    const path = layer.route?.path;
                    const method = layer.route?.stack[0].method;

                    const name = (layer.route?.path as string).replace(`${KtqConfigConstant.getVersionPrefix()}/`, '');

                    return {
                        path: path.endsWith('/') ? path.slice(0, -1) : path,
                        name: name.endsWith('/') ? name.slice(0, -1) : name,
                        method: method.toUpperCase(),
                    };
                }
            })
            .filter((item) => item !== undefined && ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(item.method));

        const uniqueRoutes = new Map();

        routes.forEach((route) => {
            const key = `${route.path}:${route.method}`;
            if (!uniqueRoutes.has(key)) {
                uniqueRoutes.set(key, route);
            }
        });

        const result = Array.from(uniqueRoutes.values());

        return result;
    }
}
