import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export default [
    {
        path: 'admin/auth/register',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/login',
        method: RequestMethod.POST,
    },
] as (string | RouteInfo)[];
