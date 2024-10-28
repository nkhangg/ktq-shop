import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { KtqAuthenticationsService } from './ktq-authentications.service';
import { KtqAdminUsersService } from '../ktq-admin-users/ktq-admin-users.service';
import { KtqSessionsService } from '../ktq-sessions/ktq-sessions.service';
import KtqAdminUser from '@/entities/ktq-admin-users.entity';
import { UserRoleType } from '@/common/enums/user-role-type.enum';
import { Request } from 'express';
import { KtqRolesService } from '../ktq-roles/ktq-roles.service';
import KtqRole from '@/entities/ktq-roles.entity';
import KtqRolesConstant from '@/constants/ktq-roles.constant';
import KtqResponse from '@/common/systems/response/ktq-response';
import { plainToClass } from 'class-transformer';
import { RegisterKtqAdminUserDto } from '@/common/dtos/ktq-authentication.dto';

describe('KtqAuthenticationsService', () => {
    let service: KtqAuthenticationsService;
    let adminUserService: KtqAdminUsersService;
    let sessionService: KtqSessionsService;
    let jwtService: JwtService;
    let rolesService: KtqRolesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                KtqAuthenticationsService,
                {
                    provide: KtqAdminUsersService,
                    useValue: {
                        findByUsername: jest.fn(),
                        findByUsernameAndEmail: jest.fn(),
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: KtqSessionsService,
                    useValue: {
                        getSessionByData: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: KtqRolesService,
                    useValue: {
                        findOne: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                    },
                },
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<KtqAuthenticationsService>(KtqAuthenticationsService);
        adminUserService = module.get<KtqAdminUsersService>(KtqAdminUsersService);
        rolesService = module.get<KtqRolesService>(KtqRolesService);
        sessionService = module.get<KtqSessionsService>(KtqSessionsService);
        jwtService = module.get<JwtService>(JwtService);
    });

    describe('generateMD5Hash', () => {
        it('should generate a correct MD5 hash', () => {
            const input = 'testInput';
            const expectedHash = crypto.createHash('md5').update(input).digest('hex');
            const generatedHash = service.generateMD5Hash(input);

            expect(generatedHash).toBe(expectedHash);
        });

        it('should generate different hashes for different inputs', () => {
            const input1 = 'testInput1';
            const input2 = 'testInput2';
            const hash1 = service.generateMD5Hash(input1);
            const hash2 = service.generateMD5Hash(input2);

            expect(hash1).not.toBe(hash2);
        });
    });

    describe('verifyMD5Hash', () => {
        it('should return true for matching input and hash', () => {
            const input = 'testInput';
            const originalHash = service.generateMD5Hash(input);

            const isMatch = service.verifyMD5Hash(input, originalHash);

            expect(isMatch).toBe(true);
        });

        it('should return false for non-matching input and hash', () => {
            const input = 'testInput';
            const originalHash = service.generateMD5Hash(input);
            const differentInput = 'differentInput';

            const isMatch = service.verifyMD5Hash(differentInput, originalHash);

            expect(isMatch).toBe(false);
        });
    });

    describe('createToken', () => {
        it('should call jwtService.sign with the correct payload and options', () => {
            const payload = { userId: 1, username: 'testUser' };
            const options = { expiresIn: '1h' };

            // Gọi hàm createToken
            service.createToken(payload, options);

            // Kiểm tra xem jwtService.sign có được gọi với đúng payload và options không
            expect(jwtService.sign).toHaveBeenCalledWith(payload, options);
        });

        it('should call jwtService.sign with the correct payload when no options are provided', () => {
            const payload = { userId: 1, username: 'testUser' };

            // Gọi hàm createToken mà không có options
            service.createToken(payload);

            // Kiểm tra xem jwtService.sign có được gọi với đúng payload không
            expect(jwtService.sign).toHaveBeenCalledWith(payload, undefined);
        });
    });

    describe('createAccessToken', () => {
        it('should create an access token with session key', () => {
            const user = new KtqAdminUser();
            user.id = 1;
            jest.spyOn(service, 'createToken').mockReturnValue('access_token');

            const { token, sessionKey } = service.createAccessToken(user);

            expect(token).toBe('access_token');
            expect(sessionKey).toBeDefined();
        });
    });

    describe('createRefreshToken', () => {
        it('should create a refresh token with session key', () => {
            const user = new KtqAdminUser();
            user.id = 1;
            jest.spyOn(service, 'createToken').mockReturnValue('refresh_token');

            const { token } = service.createRefreshToken(user);

            expect(token).toBe('refresh_token');
        });
    });

    describe('validateUser', () => {
        it('should return user if password matches', async () => {
            const admin = new KtqAdminUser();
            admin.password_hash = await bcrypt.hash('password', 10);
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            const result = await service.validateUser('username', 'password');

            expect(result).toBe(admin);
        });

        it('should return null if password does not match', async () => {
            const admin = new KtqAdminUser();
            admin.password_hash = await bcrypt.hash('password', 10);
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            const result = await service.validateUser('username', 'wrong_password');

            expect(result).toBeNull();
        });
    });

    describe('getClientInfo', () => {
        it('should return null if request is {} is not present', async () => {
            const request = {} as Request;
            const result = await service.getClientInfo(request);

            expect(result).toBeNull();
        });

        it('should return null if user-agent is not present', async () => {
            const request = { headers: {}, ip: '192.168.1.1' } as Request; // Không có user-agent trong headers

            const result = await service.getClientInfo(request); // Gọi hàm getClientInfo

            expect(result).toBeNull();
        });

        it('should return null if [ip] and [user-agent] is not present', async () => {
            const request = { headers: {} } as Request;

            const result = await service.getClientInfo(request);

            expect(result).toBeNull();
        });

        it('should return client info with device type', async () => {
            const mockUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
            const request = { headers: { 'user-agent': mockUserAgent }, ip: '192.168.1.1' } as Request;

            const expectedDeviceType = 'desktop'; // Giả định UAParser trả về 'desktop' cho user agent này

            const result = await service.getClientInfo(request);

            expect(result).toEqual({
                clientIp: '192.168.1.1',
                userAgent: mockUserAgent,
                deviceType: expectedDeviceType,
            });
        });

        it('should return client info with mobile device type', async () => {
            const mockUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1';
            const request = { headers: { 'user-agent': mockUserAgent }, ip: '192.168.1.1' } as Request;

            const expectedDeviceType = 'mobile'; // Giả định UAParser trả về 'mobile' cho user agent này

            const result = await service.getClientInfo(request);

            expect(result).toEqual({
                clientIp: '192.168.1.1',
                userAgent: mockUserAgent,
                deviceType: expectedDeviceType,
            });
        });
    });

    describe('adminLogin', () => {
        it('should throw error if user not found', async () => {
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(null);

            await expect(service.adminLogin({ username: 'test', password: 'password' }, {} as Request)).rejects.toThrow(BadRequestException);
        });

        it('should throw error if password does not match', async () => {
            const admin = new KtqAdminUser();
            admin.password_hash = await bcrypt.hash('correct_password', 10);
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            await expect(service.adminLogin({ username: 'test', password: 'wrong_password' }, {} as Request)).rejects.toThrow(BadRequestException);
        });

        it('should return token if login successful with session is null', async () => {
            const admin = new KtqAdminUser();
            admin.id = 1;
            admin.password_hash = await bcrypt.hash('password', 10);

            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);
            jest.spyOn(service, 'createAccessToken').mockReturnValue({
                token: 'access_token',
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
                expiresAt: new Date().toISOString(),
            });
            jest.spyOn(service, 'createRefreshToken').mockReturnValue({
                token: 'refresh_token',
                expiresAt: new Date().toISOString(),
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
            });

            jest.spyOn(sessionService, 'getSessionByData').mockResolvedValue(null);
            jest.spyOn(sessionService, 'create').mockResolvedValue({
                id: 1,
                expires_at: new Date(),
                payload: JSON.stringify({ host: '127.0.0.1' }),
                session_token: 'session_md5_key',
                user_id: admin.id,
                user_role_type: UserRoleType.ADMIN,
                created_at: new Date(),
                updated_at: new Date(),
                live: true,
            });

            const response = await service.adminLogin({ username: 'test', password: 'password' }, {} as Request);

            expect(response.token).toBe('access_token');
            expect(response.refresh_token).toBe('refresh_token');
        });

        it('should return token if login successful with have session', async () => {
            const admin = new KtqAdminUser();
            admin.id = 1;
            admin.password_hash = await bcrypt.hash('password', 10);

            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);
            jest.spyOn(service, 'createAccessToken').mockReturnValue({
                token: 'access_token',
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
                expiresAt: new Date().toISOString(),
            });
            jest.spyOn(service, 'createRefreshToken').mockReturnValue({
                token: 'refresh_token',
                expiresAt: new Date().toISOString(),
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
            });

            jest.spyOn(sessionService, 'getSessionByData').mockResolvedValue({
                created_at: new Date(),
                updated_at: new Date(),
                expires_at: new Date(),
                id: 1,
                live: true,
                payload: null,
                session_token: 'session_token',
                user_id: admin.id,
                user_role_type: UserRoleType.ADMIN,
            });

            const response = await service.adminLogin({ username: 'test', password: 'password' }, {} as Request);

            expect(response.token).toBe('access_token');
            expect(response.refresh_token).toBe('refresh_token');
        });

        it('should throw BadRequestException if session is not created', async () => {
            const admin = new KtqAdminUser();
            admin.id = 1;
            admin.password_hash = await bcrypt.hash('password', 10);

            // Mô phỏng để findByUsername trả về một admin hợp lệ
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            // Mô phỏng để createAccessToken và createRefreshToken trả về token hợp lệ
            jest.spyOn(service, 'createAccessToken').mockReturnValue({
                token: 'access_token',
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
                expiresAt: new Date().toISOString(),
            });

            jest.spyOn(service, 'createRefreshToken').mockReturnValue({
                token: 'refresh_token',
                expiresAt: new Date().toISOString(),
                sessionKey: 'session_key',
                sessionMD5Key: 'session_md5_key',
            });

            // Mô phỏng getSessionByData để trả về null
            jest.spyOn(sessionService, 'getSessionByData').mockResolvedValue(null);

            // **Chỗ này cần thay đổi**: Mô phỏng create để trả về null
            jest.spyOn(sessionService, 'create').mockResolvedValue(null);

            // Gọi adminLogin và mong đợi ném ra BadRequestException
            await expect(service.adminLogin({ username: 'test', password: 'password' }, {} as Request)).rejects.toThrow(new BadRequestException('Session was not created'));
        });
    });

    describe('adminRegister', () => {
        it('should the role is Super Admin', async () => {
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(null);

            jest.spyOn(adminUserService, 'findByEmail').mockResolvedValue(null);

            const superAdminRole = KtqRolesConstant.getRoles().find((item) => item.role_name === KtqRolesConstant.SUPER_ADMIN);

            jest.spyOn(rolesService, 'findOne').mockResolvedValue(superAdminRole);

            await expect(service.adminRegister({ username: 'khangpn', password: 'password', email: 'khang@gmail.com', role_id: superAdminRole.id })).rejects.toThrow(
                new BadRequestException('The role is not allowed to set up this account'),
            );
        });

        it('should create a new admin successfully', async () => {
            const dto: RegisterKtqAdminUserDto = {
                username: 'newUser',
                password: 'password123',
                email: 'test@example.com',
                role_id: 2,
            };

            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(null);

            jest.spyOn(adminUserService, 'findByEmail').mockResolvedValue(null);

            jest.spyOn(rolesService, 'findOne').mockResolvedValue({
                id: 2,
                role_name: 'admin',
                adminUsers: [],
                rolePermissions: [],
                roleResources: [],
                created_at: new Date(),
                updated_at: new Date(),
            });

            jest.spyOn(adminUserService, 'create').mockResolvedValue({
                id: 1,
                username: 'newUser',
                email: 'test@example.com',
                password_hash: 'hashedPassword',
                first_name: null,
                last_name: null,
                is_active: true,
                role: null,
                created_at: new Date(),
                updated_at: new Date(),
            });

            const result = await service.adminRegister(dto);

            expect(result).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining({
                        id: 1,
                        username: 'newUser',
                        email: 'test@example.com',
                    }),
                    message: '',
                    status_code: 200,
                }),
            );
        });
    });
});
