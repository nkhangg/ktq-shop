import moment from 'moment';
import * as crypto from 'crypto';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import UAParser from 'ua-parser-js';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import KtqResponse from '@/common/systems/response/ktq-response';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';
import { KtqAdminUsersService } from '../ktq-admin-users/ktq-admin-users.service';
import { KtqRolesService } from '../ktq-roles/ktq-roles.service';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import { LoginKtqAdminUserDto, RegisterKtqAdminUserDto } from '@/common/dtos/ktq-authentication.dto';
import { TTokenData } from '@/common/decorators/token-data.decorator';
@Injectable()
export class KtqAuthenticationsService {
    constructor(
        private ktqAdminUserService: KtqAdminUsersService,
        private ktqSessionService: KtqSessionsService,
        private ktqRolesService: KtqRolesService,
        private readonly jwtService: JwtService,
    ) {}

    generateMD5Hash(input: string): string {
        return crypto.createHash('md5').update(input).digest('hex');
    }

    verifyMD5Hash(input: string, originalHash: string): boolean {
        const inputHash = this.generateMD5Hash(input);
        return inputHash === originalHash;
    }

    createToken(payload: any, options?: { expiresIn?: string }): string {
        return this.jwtService.sign(payload, options);
    }

    createAccessToken(user: KtqAdminUser | KtqCustomer, options?: { sessionMD5Key?: string; class?: UserRoleType }) {
        const sessionKey = uuid();

        const sessionMD5Key = options?.sessionMD5Key || this.generateMD5Hash(sessionKey);

        const expiresIn = '1h';

        const token = this.createToken({ id: user.id, class: options?.class || UserRoleType.ADMIN, session_key: sessionMD5Key }, { expiresIn });

        const expiresAt = moment().add(1, 'hour').toISOString();

        return {
            sessionMD5Key,
            sessionKey,
            token,
            expiresAt,
        };
    }

    createRefreshToken(user: KtqAdminUser | KtqCustomer, options?: { sessionMD5Key?: string; class?: UserRoleType }) {
        const sessionKey = uuid();

        const sessionMD5Key = options?.sessionMD5Key;

        const expiresIn = '1d';

        const token = this.createToken({ id: user.id, class: options?.class || UserRoleType.ADMIN, session_key: sessionMD5Key }, { expiresIn });

        const expiresAt = moment().add(1, 'day').toISOString();
        return {
            sessionMD5Key,
            sessionKey,
            token,
            expiresAt,
        };
    }

    async validateUser(username: string, pass: string): Promise<KtqAdminUser> {
        const admin = await this.ktqAdminUserService.findByUsername(username);
        if (admin && (await bcrypt.compare(pass, admin.password_hash))) {
            return admin;
        }
        return null;
    }

    async getClientInfo(request: Request) {
        if (Object.keys(request).length <= 0) return null;

        const userAgent = request?.headers['user-agent'] || null;

        if (!userAgent || !request?.ip) return null;
        const parser = new UAParser(userAgent);
        const deviceType = parser.getDevice().type || 'desktop'; // Lấy loại thiết bị

        return {
            clientIp: request.ip,
            userAgent,
            deviceType,
        };
    }

    async adminLogin({ username, password }: LoginKtqAdminUserDto, request: Request) {
        const admin = await this.validateUser(username, password);

        if (!admin) {
            throw new BadRequestException('Username or Password is incorrect');
        }

        const clientInfo = await this.getClientInfo(request);
        const clientJson = JSON.stringify(clientInfo);

        const sessionData = await this.ktqSessionService.getSessionByData({ user_id: admin.id, user_role_type: UserRoleType.ADMIN, payload: clientJson });

        const { token, sessionMD5Key, expiresAt } = this.createAccessToken(admin);
        const refreshToken = this.createRefreshToken(admin, { sessionMD5Key: sessionMD5Key });

        if (sessionData) {
            this.ktqSessionService.update(sessionData.id, { ...sessionData, expires_at: new Date(expiresAt), session_token: sessionMD5Key, payload: clientJson });

            return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { bonus: { token, refresh_token: refreshToken.token } });
        } else {
            const session = await this.ktqSessionService.create({
                expires_at: new Date(expiresAt),
                payload: clientJson,
                session_token: sessionMD5Key,
                user_id: admin.id,
                user_role_type: UserRoleType.ADMIN,
            });

            if (!session) {
                throw new BadRequestException('Session was not created');
            }

            return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { bonus: { token, refresh_token: refreshToken.token } });
        }
    }

    async adminRegister({ username, password, email, role_id }: RegisterKtqAdminUserDto) {
        const roleData = await this.ktqRolesService.findOne(role_id);

        if (roleData.role_name === KtqRolesConstant.SUPER_ADMIN) {
            throw new BadRequestException('The role is not allowed to set up this account');
        }

        const password_hash = bcrypt.hashSync(password);

        const newAdmin = await this.ktqAdminUserService.create({ email, password_hash, role: roleData, username });

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, newAdmin));
    }

    async logout(tokenData: TTokenData) {
        const session = await this.ktqSessionService.findByTokenData(tokenData);

        if (!session) throw new BadRequestException('You are leaving our website');

        const result = await this.ktqSessionService.update(session.id, { live: false });

        if (!result) throw new BadRequestException("The session can't delete");

        return KtqResponse.toResponse(true, { message: 'Logout successfully' });
    }

    async getAdminProfile(tokenData: TTokenData) {
        const admin = await this.ktqAdminUserService.findOne(tokenData.id);

        return KtqResponse.toResponse(admin, { message: 'Profile was got' });
    }
}
