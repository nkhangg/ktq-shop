// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UserRoleType } from '../enums/user-role-type.enum';

export type TTokenData = { id: number; class: UserRoleType; session_key: string; iat: number; exp: number };

export const TokenData = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const authorization: string = request.headers['authorization'];

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        return decoded as TTokenData;
    } catch (error) {
        throw new Error('Invalid token');
    }
});
