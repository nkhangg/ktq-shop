import { TTokenData } from '@/common/decorators/token-data.decorator';
import {
    AdminForgotPasswordDto,
    ChangePasswordForgot,
    CustomerForgotPasswordDto,
    LoginKtqAdminUserDto,
    LoginKtqCustomerDto,
    RefreshTokenDto,
    RegisterKtqAdminUserDto,
    RegisterKtqCustomerDto,
} from '@/common/dtos/ktq-authentication.dto';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import KtqResponse from '@/common/systems/response/ktq-response';
import KtqAppConstant from '@/constants/ktq-app.constant';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import KtqCustomer from '@/entities/ktq-customers.entity';
import KtqSession from '@/entities/ktq-sessions.entity';
import { BadRequestException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpStatusCode } from 'axios';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import * as crypto from 'crypto';
import { Request } from 'express';
import moment from '@/utils/moment';
import UAParser from 'ua-parser-js';
import { v4 as uuid } from 'uuid';
import { KtqAdminUsersService } from '../ktq-admin-users/ktq-admin-users.service';
import { KtqConfigEmailsService } from '../ktq-config-emails/ktq-config-emails.service';
import { KtqCustomersService } from '../ktq-customers/ktq-customers.service';
import { KtqRolesService } from '../ktq-roles/ktq-roles.service';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';
import { KtqUserForgotPasswordsService } from '../ktq-user-forgot-passwords/ktq-user-forgot-passwords.service';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { KtqQueuesService } from '../ktq-queues/ktq-queues.service';
import KtqCustomerGroupsConstant from '@/constants/ktq-customer-groups.constant';
@Injectable()
export class KtqAuthenticationsService {
    constructor(
        private ktqAdminUserService: KtqAdminUsersService,
        private ktqSessionService: KtqSessionsService,
        private ktqCustomerService: KtqCustomersService,
        private ktqRolesService: KtqRolesService,
        private readonly jwtService: JwtService,
        private readonly ktqUserForgotPasswordsService: KtqUserForgotPasswordsService,
        private readonly ktqConfigMailService: KtqConfigEmailsService,
        private readonly ktqQueueService: KtqQueuesService,
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

        const ttlData = KtqAppConstant.getTllToken();

        const expiresIn = ttlData.ttl;
        // const expiresIn = '10s';

        const token = this.createToken({ id: user.id, class: options?.class || UserRoleType.ADMIN, session_key: sessionMD5Key }, { expiresIn });

        // const expiresAt = moment().add(10, 'second').toISOString();
        const expiresAt = moment().add(ttlData.ttl_value, ttlData.mapping_unit).toISOString();

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

        const ttlData = KtqAppConstant.getTllRefreshToken();

        const expiresIn = ttlData.ttl;
        // const expiresIn = '20s';

        const token = this.createToken({ id: user.id, class: options?.class || UserRoleType.ADMIN, session_key: sessionMD5Key }, { expiresIn });

        // const expiresAt = moment().add(20, 'second').toISOString();
        const expiresAt = moment().add(ttlData.ttl_value, ttlData.mapping_unit).toISOString();
        return {
            sessionMD5Key,
            sessionKey,
            token,
            expiresAt,
        };
    }

    async validateAdminUser(username: string, pass: string): Promise<KtqAdminUser> {
        const admin = await this.ktqAdminUserService.findByUsername(username);
        if (admin && (await bcrypt.compare(pass, admin.password_hash))) {
            return admin;
        }
        return null;
    }

    async validateCustomer(username: string, pass: string): Promise<KtqCustomer> {
        const customer = await this.ktqCustomerService.findByUsername(username);
        if (customer && (await bcrypt.compare(pass, customer.password))) {
            return customer;
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

    async adminRefreshToken({ refresh_token }: RefreshTokenDto) {
        if (refresh_token.length <= 1) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Refresh token is valid', status_code: HttpStatus.BAD_REQUEST }));

        let session: KtqSession | null = null;

        try {
            const tokenData: TTokenData = await this.jwtService.verify(refresh_token);

            session = await this.ktqSessionService.findByTokenData(tokenData);

            if (!session) throw new BadRequestException({});
        } catch (error) {
            throw new UnauthorizedException(KtqResponse.toResponse(null, { message: 'Refresh token is expired', status_code: HttpStatus.UNAUTHORIZED }));
        }

        const expiredTime = moment(session.expires_at); // Sử dụng moment để lấy thời gian hết hạn
        const now = moment(); // Sử dụng moment để lấy thời gian hiện tại

        if (now.isBefore(expiredTime.subtract(1, 'second'))) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session still valid', status_code: HttpStatus.BAD_REQUEST }));
        }

        if (session.user_role_type !== UserRoleType.ADMIN) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The admin is not found', status_code: HttpStatus.NOT_FOUND }));
        }

        const admin = await this.ktqAdminUserService.findOne(session.user_id);

        if (!admin) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The admin is not found', status_code: HttpStatus.NOT_FOUND }));

        const { token, sessionMD5Key, expiresAt } = this.createAccessToken(admin);
        const refreshToken = this.createRefreshToken(admin, { sessionMD5Key: sessionMD5Key });

        const newSession = await this.ktqSessionService.update(session.id, { ...session, expires_at: new Date(expiresAt), session_token: sessionMD5Key });

        if (!newSession) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session is not define', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { bonus: { token, refresh_token: refreshToken.token } });
    }

    async customerRefreshToken({ refresh_token }: RefreshTokenDto) {
        if (refresh_token.length <= 1) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Refresh token is valid', status_code: HttpStatus.BAD_REQUEST }));

        let session: KtqSession | null = null;

        try {
            const tokenData: TTokenData = await this.jwtService.verify(refresh_token);

            session = await this.ktqSessionService.findByTokenData(tokenData);

            if (!session) throw new BadRequestException({});
        } catch (error) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'Refresh token is expired', status_code: HttpStatus.FORBIDDEN }));
        }

        const expiredTime = new Date(session.expires_at);
        const now = new Date();

        if (now <= expiredTime) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session still valid', status_code: HttpStatus.BAD_REQUEST }));
        }

        if (session.user_role_type !== UserRoleType.CUSTOMER) {
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The customer is not found', status_code: HttpStatus.NOT_FOUND }));
        }

        const customer = await this.ktqCustomerService.findOne(session.user_id);

        if (!customer) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The customer is not found', status_code: HttpStatus.NOT_FOUND }));

        const { token, sessionMD5Key, expiresAt } = this.createAccessToken(customer, { class: UserRoleType.CUSTOMER });
        const refreshToken = this.createRefreshToken(customer, { sessionMD5Key: sessionMD5Key, class: UserRoleType.CUSTOMER });

        const newSession = await this.ktqSessionService.update(session.id, { ...session, expires_at: new Date(expiresAt), session_token: sessionMD5Key });

        if (!newSession) throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session is not define', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, customer), { bonus: { token, refresh_token: refreshToken.token } });
    }

    async adminLogin({ username, password }: LoginKtqAdminUserDto, request: Request) {
        const admin = await this.validateAdminUser(username, password);

        if (!admin) {
            throw new BadRequestException('Username or Password is incorrect');
        }

        const clientInfo = await this.getClientInfo(request);
        const clientJson = JSON.stringify(clientInfo);

        const sessionData = await this.ktqSessionService.getSessionByData({ user_id: admin.id, user_role_type: UserRoleType.ADMIN, clientInfo });

        const { token, sessionMD5Key, expiresAt } = this.createAccessToken(admin);
        const refreshToken = this.createRefreshToken(admin, { sessionMD5Key: sessionMD5Key });

        if (sessionData) {
            this.ktqSessionService.update(sessionData.id, {
                ...sessionData,
                expires_at: new Date(expiresAt),
                session_token: sessionMD5Key,
                payload: clientJson,
                user_agent: clientInfo.userAgent,
            });

            return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { bonus: { token, refresh_token: refreshToken.token } });
        } else {
            const session = await this.ktqSessionService.create({
                expires_at: new Date(expiresAt),
                payload: clientJson,
                session_token: sessionMD5Key,
                user_id: admin.id,
                user_role_type: UserRoleType.ADMIN,
                user_agent: clientInfo.userAgent,
            });

            if (!session) {
                throw new BadRequestException('Session was not created');
            }

            return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { bonus: { token, refresh_token: refreshToken.token } });
        }
    }

    async customerLogin({ username, password }: LoginKtqCustomerDto, request: Request) {
        const customer = await this.validateCustomer(username, password);

        if (!customer) {
            throw new BadRequestException('Username or Password is incorrect');
        }

        const clientInfo = await this.getClientInfo(request);
        const clientJson = JSON.stringify(clientInfo);

        const sessionData = await this.ktqSessionService.getSessionByData({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, clientInfo });

        const { token, sessionMD5Key, expiresAt } = this.createAccessToken(customer, { class: UserRoleType.CUSTOMER });
        const refreshToken = this.createRefreshToken(customer, { sessionMD5Key: sessionMD5Key, class: UserRoleType.CUSTOMER });

        if (sessionData) {
            this.ktqSessionService.update(sessionData.id, {
                ...sessionData,
                expires_at: new Date(expiresAt),
                session_token: sessionMD5Key,
                payload: clientJson,
                user_agent: clientInfo.userAgent,
            });

            return KtqResponse.toResponse(plainToClass(KtqCustomer, customer), { bonus: { token, refresh_token: refreshToken.token } });
        } else {
            const session = await this.ktqSessionService.create({
                expires_at: new Date(expiresAt),
                payload: clientJson,
                session_token: sessionMD5Key,
                user_id: customer.id,
                user_role_type: UserRoleType.CUSTOMER,
                user_agent: clientInfo.userAgent,
            });

            if (!session) {
                throw new BadRequestException('Session was not created');
            }

            return KtqResponse.toResponse(plainToClass(KtqCustomer, customer), { bonus: { token, refresh_token: refreshToken.token } });
        }
    }

    async adminRegister({ username, password, email, role_id }: RegisterKtqAdminUserDto) {
        const roleData = await this.ktqRolesService.findOne(role_id);

        if (!roleData) {
            throw new BadRequestException('The role is required');
        }

        if (roleData.role_name === KtqRolesConstant.SUPER_ADMIN) {
            throw new BadRequestException('The role is not allowed to set up this account');
        }

        const password_hash = bcrypt.hashSync(password);

        const newAdmin = await this.ktqAdminUserService.create({ email, password_hash, role: roleData, username });

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, newAdmin));
    }

    async customerRegister({ username, password, email }: RegisterKtqCustomerDto) {
        const password_hash = bcrypt.hashSync(password);

        const newCustomer = await this.ktqCustomerService.create({ email, password: password_hash, username, customerGroup: KtqCustomerGroupsConstant.getCustomerGeneralGroup() });

        return KtqResponse.toResponse(plainToClass(KtqCustomer, newCustomer));
    }

    async logout(tokenData: TTokenData) {
        const session = await this.ktqSessionService.findByTokenData(tokenData);

        if (!session) throw new BadRequestException('You are leaving our website');

        const result = await this.ktqSessionService.update(session.id, { live: false });

        if (!result) throw new BadRequestException("The session can't delete");

        return KtqResponse.toResponse(true, { message: 'Logout successfully' });
    }

    async getCurrentAdminProfile(tokenData: TTokenData) {
        const admin = await this.ktqAdminUserService.findOne(tokenData.id);

        if (tokenData.class !== UserRoleType.ADMIN)
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The admin not found', status_code: HttpStatus.NOT_FOUND }));

        if (!admin) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The admin not found', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, admin), { message: 'Profile was got' });
    }

    async getCurrentCustomerProfile(tokenData: TTokenData) {
        const customer = await this.ktqCustomerService.findOne(tokenData.id);

        if (tokenData.class !== UserRoleType.CUSTOMER)
            throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The customer not found', status_code: HttpStatus.NOT_FOUND }));

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The customer not found', status_code: HttpStatus.NOT_FOUND }));

        return KtqResponse.toResponse(plainToClass(KtqCustomer, customer), { message: 'Profile was got' });
    }

    async getUserFromTokenData(tokenData: TTokenData) {
        const userClass = tokenData.class;

        switch (userClass) {
            case UserRoleType.CUSTOMER:
                return await this.ktqCustomerService.findOne(tokenData.id);

            case UserRoleType.ADMIN:
                return await this.ktqAdminUserService.findOne(tokenData.id);
            default:
                throw new BadRequestException(KtqResponse.toResponse(null, { message: `Invalid user class` }));
        }
    }

    async adminForgotPassword({ email }: AdminForgotPasswordDto) {
        const code = uuid();

        const admin = await this.ktqAdminUserService.findByEmail(email);

        const forgotData = await this.ktqUserForgotPasswordsService.findOneWith({
            where: {
                email,
                user_role_type: UserRoleType.ADMIN,
                forgotten: false,
            },
        });

        const ttl_data = KtqAppConstant.getTllResetLink();

        if (!forgotData) {
            this.ktqUserForgotPasswordsService.create({
                email,
                code,
                send_at: moment().toDate(),
                time_expired: moment().add(ttl_data.ttl_value, ttl_data.mapping_unit).toDate(),
            });
        } else {
            this.ktqUserForgotPasswordsService.update(forgotData.id, {
                code,
                time_expired: moment().add(ttl_data.ttl_value, ttl_data.mapping_unit).toDate(),
                send_at: moment().toDate(),
            });
        }

        const reset_link = `${KtqConfigConstant.getClientAppUrl().key_value}/${code}`;

        const result = await this.ktqQueueService.addEmailJob({ reset_link, to: admin.email, name: admin.username });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The email send failure`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(true);
    }

    async customerForgotPassword({ email }: CustomerForgotPasswordDto) {
        const code = uuid();

        const customer = await this.ktqCustomerService.findByEmail(email);

        const forgotData = await this.ktqUserForgotPasswordsService.findOneWith({
            where: {
                email,
                user_role_type: UserRoleType.CUSTOMER,
                forgotten: false,
            },
        });

        const ttl_data = KtqAppConstant.getTllResetLink();

        if (!forgotData) {
            this.ktqUserForgotPasswordsService.create({
                email,
                code,
                send_at: moment().toDate(),
                time_expired: moment().add(ttl_data.ttl_value, ttl_data.mapping_unit).toDate(),
            });
        } else {
            this.ktqUserForgotPasswordsService.update(forgotData.id, {
                code,
                time_expired: moment().add(ttl_data.ttl_value, ttl_data.mapping_unit).toDate(),
                send_at: moment().toDate(),
            });
        }

        const reset_link = `${KtqConfigConstant.getClientAppUrl().key_value}/${code}`;

        const result = await this.ktqQueueService.addEmailJob({ reset_link, to: customer.email, name: customer.username });

        if (!result) throw new BadRequestException(KtqResponse.toResponse(null, { message: `The email send failure`, status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(true);
    }

    async adminChangePasswordForgot({ code, new_password }: ChangePasswordForgot) {
        const forgotData = await this.ktqUserForgotPasswordsService.findOneWith({ where: { code, forgotten: false, user_role_type: UserRoleType.ADMIN } });

        const expiredTime = moment(forgotData.time_expired);
        const now = moment();

        if (now.isAfter(expiredTime.subtract(1, 'second'))) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session expired', status_code: HttpStatus.BAD_REQUEST }));
        }

        const admin = await this.ktqAdminUserService.findByEmail(forgotData.email);

        if (!admin) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The user not found', status_code: HttpStatusCode.NotFound }));

        const result_update_forgot = await this.ktqUserForgotPasswordsService.update(forgotData.id, { forgotten: true });

        if (!result_update_forgot)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The change password is failure', status_code: HttpStatusCode.BadRequest }));

        const new_password_hash = bcrypt.hashSync(new_password);

        const result = await this.ktqAdminUserService.update(admin.id, { password_hash: new_password_hash });

        const sessionUpdated = await this.ktqSessionService.updates({ user_id: admin.id, user_role_type: UserRoleType.ADMIN, live: true }, { live: false });

        if (!result || !sessionUpdated)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The change password is failure', status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }

    async customerChangePasswordForgot({ code, new_password }: ChangePasswordForgot) {
        const forgotData = await this.ktqUserForgotPasswordsService.findOneWith({ where: { code, forgotten: false, user_role_type: UserRoleType.CUSTOMER } });

        const expiredTime = moment(forgotData.time_expired);
        const now = moment();

        if (now.isAfter(expiredTime.subtract(1, 'second'))) {
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The session expired', status_code: HttpStatus.BAD_REQUEST }));
        }

        const customer = await this.ktqCustomerService.findByEmail(forgotData.email);

        if (!customer) throw new NotFoundException(KtqResponse.toResponse(null, { message: 'The user not found', status_code: HttpStatusCode.NotFound }));

        const result_update_forgot = await this.ktqUserForgotPasswordsService.update(forgotData.id, { forgotten: true });

        if (!result_update_forgot)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The change password is failure', status_code: HttpStatusCode.BadRequest }));

        const new_password_hash = bcrypt.hashSync(new_password);

        const result = await this.ktqCustomerService.update(customer.id, { password: new_password_hash });

        const sessionUpdated = await this.ktqSessionService.updates({ user_id: customer.id, user_role_type: UserRoleType.CUSTOMER, live: true }, { live: false });

        if (!result || !sessionUpdated)
            throw new BadRequestException(KtqResponse.toResponse(null, { message: 'The change password is failure', status_code: HttpStatusCode.BadRequest }));

        return KtqResponse.toResponse(plainToClass(KtqAdminUser, result));
    }
}
