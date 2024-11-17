import { RequestMethod } from '@nestjs/common';
import { RouteInfo } from '@nestjs/common/interfaces';

export const excludeAuth = [
    {
        path: 'admin/auth/register',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/login',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/refresh-token',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/forgot-password',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/grant-new-password',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/register',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/login',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/refresh-token',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/forgot-password',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/grant-new-password',
        method: RequestMethod.POST,
    },
] as (string | RouteInfo)[];

export const excludeAuthorization = [
    {
        path: 'admin/auth/login',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/refresh-token',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/me',
        method: RequestMethod.GET,
    },
    {
        path: 'admin/auth/logout',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/forgot-password',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/grant-new-password',
        method: RequestMethod.POST,
    },
];

export const excludeResource = [
    ...excludeAuth,
    {
        path: 'admin/auth/logout',
        method: RequestMethod.POST,
    },
    {
        path: 'auth/logout',
        method: RequestMethod.POST,
    },
    {
        path: 'admin/auth/me',
        method: RequestMethod.GET,
    },
    {
        path: 'auth/me',
        method: RequestMethod.GET,
    },
];
