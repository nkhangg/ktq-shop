import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
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
import { RefreshTokenDto, RegisterKtqAdminUserDto, RegisterKtqCustomerDto } from '@/common/dtos/ktq-authentication.dto';
import { TTokenData } from '@/common/decorators/token-data.decorator';
import KtqSession from '@/entities/ktq-sessions.entity';
import { KtqCustomersService } from '../ktq-customers/ktq-customers.service';
import KtqCustomer from '@/entities/ktq-customers.entity';

describe('KtqAuthenticationsService', () => {
    let service: KtqAuthenticationsService;
    let adminUserService: KtqAdminUsersService;
    let customerService: KtqCustomersService;
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
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: KtqCustomersService,
                    useValue: {
                        create: jest.fn(),
                        findByUsername: jest.fn(),
                        findByEmail: jest.fn(),
                        findOne: jest.fn(),
                    },
                },
                {
                    provide: KtqSessionsService,
                    useValue: {
                        getSessionByData: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                        findByTokenData: jest.fn(),
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
                        verify: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<KtqAuthenticationsService>(KtqAuthenticationsService);
        adminUserService = module.get<KtqAdminUsersService>(KtqAdminUsersService);
        customerService = module.get<KtqCustomersService>(KtqCustomersService);
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

    describe('validateAdminUser', () => {
        it('should return user if password matches', async () => {
            const admin = new KtqAdminUser();
            admin.password_hash = await bcrypt.hash('password', 10);
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            const result = await service.validateAdminUser('username', 'password');

            expect(result).toBe(admin);
        });

        it('should return null if password does not match', async () => {
            const admin = new KtqAdminUser();
            admin.password_hash = await bcrypt.hash('password', 10);
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(admin);

            const result = await service.validateAdminUser('username', 'wrong_password');

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

    describe('customerLogin', () => {
        it('should throw error if customer not found', async () => {
            jest.spyOn(customerService, 'findByUsername').mockResolvedValue(null);

            await expect(service.customerLogin({ username: 'test', password: 'password' }, {} as Request)).rejects.toThrow(BadRequestException);
        });

        it('should throw error if password does not match', async () => {
            const customer = new KtqCustomer();
            customer.password = await bcrypt.hash('correct_password', 10);
            jest.spyOn(customerService, 'findByUsername').mockResolvedValue(customer);

            await expect(service.customerLogin({ username: 'test', password: 'wrong_password' }, {} as Request)).rejects.toThrow(BadRequestException);
        });

        it('should return token if login successful with session is null', async () => {
            const customer = new KtqCustomer();
            customer.id = 1;
            customer.password = await bcrypt.hash('password', 10);

            jest.spyOn(customerService, 'findByUsername').mockResolvedValue(customer);
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
                user_id: customer.id,
                user_role_type: UserRoleType.ADMIN,
                created_at: new Date(),
                updated_at: new Date(),
                live: true,
            });

            const response = await service.customerLogin({ username: 'test', password: 'password' }, {} as Request);

            expect(response.token).toBe('access_token');
            expect(response.refresh_token).toBe('refresh_token');
        });

        it('should return token if login successful with have session', async () => {
            const customer = new KtqCustomer();
            customer.id = 1;
            customer.password = await bcrypt.hash('password', 10);

            jest.spyOn(customerService, 'findByUsername').mockResolvedValue(customer);
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
                user_id: customer.id,
                user_role_type: UserRoleType.ADMIN,
            });

            const response = await service.customerLogin({ username: 'test', password: 'password' }, {} as Request);

            expect(response.token).toBe('access_token');
            expect(response.refresh_token).toBe('refresh_token');
        });

        it('should throw BadRequestException if session is not created', async () => {
            const customer = new KtqCustomer();
            customer.id = 1;
            customer.password = await bcrypt.hash('password', 10);

            // Mô phỏng để findByUsername trả về một customer hợp lệ
            jest.spyOn(customerService, 'findByUsername').mockResolvedValue(customer);

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
            await expect(service.customerLogin({ username: 'test', password: 'password' }, {} as Request)).rejects.toThrow(new BadRequestException('Session was not created'));
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

        it('should throw error if the role is invalid', async () => {
            // Giả lập không tìm thấy role
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(null);
            jest.spyOn(adminUserService, 'findByEmail').mockResolvedValue(null);
            jest.spyOn(rolesService, 'findOne').mockResolvedValue(null);

            const dto: RegisterKtqAdminUserDto = {
                username: 'newUser',
                password: 'password123',
                email: 'test@example.com',
                role_id: 99, // Role không hợp lệ
            };

            await expect(service.adminRegister(dto)).rejects.toThrow(new BadRequestException('The role is required'));
        });

        it('should throw error if role is Super Admin', async () => {
            // Giả lập tên người dùng và email không tồn tại
            jest.spyOn(adminUserService, 'findByUsername').mockResolvedValue(null);
            jest.spyOn(adminUserService, 'findByEmail').mockResolvedValue(null);

            // Giả lập dữ liệu role với id = 1 (Super Admin)
            const superAdminRole = {
                ...KtqRolesConstant.getSuperAdmin(),
                adminUsers: [],
                rolePermissions: [],
                roleResources: [],
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(rolesService, 'findOne').mockResolvedValue(superAdminRole);

            const dto: RegisterKtqAdminUserDto = {
                username: 'newUser',
                password: 'password123',
                email: 'test@example.com',
                role_id: 1, // Super Admin
            };

            await expect(service.adminRegister(dto)).rejects.toThrow(new BadRequestException('The role is not allowed to set up this account'));
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

    describe('adminRefreshToken', () => {
        it('should refresh token is empty', async () => {
            const payload: RefreshTokenDto = { refresh_token: '' };

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is valid'));
        });

        it('should throw error if token data cannot be verified', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'invalid_token' };
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw new Error();
            });

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is expired'));
        });

        it('should throw error if session is not found', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(null);

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is expired'));
        });

        it('should throw error if session is still valid', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.ADMIN,
                expires_at: new Date(Date.now() + 10000), // Session vẫn còn hợp lệ
            } as KtqSession;
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('The session still valid'));
        });

        it('should throw error if admin is customer', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.CUSTOMER,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(null);

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('The admin is not found'));
        });

        it('should throw error if admin user is not found', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.ADMIN,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(null);

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('The admin is not found'));
        });

        it('should return error if session is not update', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.ADMIN,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;
            const admin = new KtqAdminUser();
            admin.id = 1;

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(admin);
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
            jest.spyOn(sessionService, 'update').mockResolvedValue(null);

            await expect(service.adminRefreshToken(payload)).rejects.toThrow(new BadRequestException('The session is not define'));
        });

        it('should return new access and refresh tokens if refresh token is valid', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.ADMIN,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;
            const admin = new KtqAdminUser();
            admin.id = 1;
            const newAccessToken = 'access_token';
            const newRefreshToken = { token: 'refresh_token' };

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(admin);
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
            jest.spyOn(sessionService, 'update').mockResolvedValue(mockSession);

            const response = await service.adminRefreshToken(payload);

            expect(response).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining(admin),
                    message: '',
                    status_code: 200,
                    token: newAccessToken,
                    refresh_token: newRefreshToken.token,
                }),
            );
        });
    });

    describe('customerRefreshToken', () => {
        it('should refresh token is empty', async () => {
            const payload: RefreshTokenDto = { refresh_token: '' };

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is valid'));
        });

        it('should throw error if token data cannot be verified', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'invalid_token' };
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                throw new Error();
            });

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is expired'));
        });

        it('should throw error if session is not found', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.ADMIN, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(null);

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('Refresh token is expired'));
        });

        it('should throw error if session is still valid', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.CUSTOMER,
                expires_at: new Date(Date.now() + 10000), // Session vẫn còn hợp lệ
            } as KtqSession;
            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.CUSTOMER, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('The session still valid'));
        });

        it('should throw error if customer is customer', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.ADMIN,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.CUSTOMER, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(customerService, 'findOne').mockResolvedValue(null);

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('The customer is not found'));
        });

        it('should throw error if customer user is not found', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.CUSTOMER,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.CUSTOMER, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(customerService, 'findOne').mockResolvedValue(null);

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('The customer is not found'));
        });

        it('should return error if session is not update', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.CUSTOMER,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;
            const customer = new KtqCustomer();
            customer.id = 1;
            const newAccessToken = 'access_token';
            const newRefreshToken = { token: 'refresh_token' };

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.CUSTOMER, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(customerService, 'findOne').mockResolvedValue(customer);
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
            jest.spyOn(sessionService, 'update').mockResolvedValue(null);

            await expect(service.customerRefreshToken(payload)).rejects.toThrow(new BadRequestException('The session is not define'));
        });

        it('should return new access and refresh tokens if refresh token is valid', async () => {
            const payload: RefreshTokenDto = { refresh_token: 'valid_token' };
            const mockSession = {
                id: 1,
                user_id: 1,
                user_role_type: UserRoleType.CUSTOMER,
                expires_at: new Date(Date.now() - 10000), // Session đã hết hạn
            } as KtqSession;
            const customer = new KtqCustomer();
            customer.id = 1;
            const newAccessToken = 'access_token';
            const newRefreshToken = { token: 'refresh_token' };

            jest.spyOn(jwtService, 'verify').mockImplementation(() => {
                return { id: 1, class: UserRoleType.CUSTOMER, session_key: 'session_key' } as TTokenData;
            });
            jest.spyOn(sessionService, 'findByTokenData').mockResolvedValue(mockSession);
            jest.spyOn(customerService, 'findOne').mockResolvedValue(customer);
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
            jest.spyOn(sessionService, 'update').mockResolvedValue(mockSession);

            const response = await service.customerRefreshToken(payload);

            expect(response).toEqual(
                expect.objectContaining({
                    data: expect.objectContaining(customer),
                    message: '',
                    status_code: 200,
                    token: newAccessToken,
                    refresh_token: newRefreshToken.token,
                }),
            );
        });
    });

    describe('logout', () => {
        it('should throw an error if session is not found', async () => {
            // Mock findByTokenData để trả về null
            (sessionService.findByTokenData as jest.Mock).mockResolvedValue(null);

            await expect(service.logout({} as TTokenData)).rejects.toThrow(new BadRequestException('You are leaving our website'));
        });

        it("should throw an error if session can't be deleted", async () => {
            // Mock findByTokenData để trả về một session hợp lệ
            (sessionService.findByTokenData as jest.Mock).mockResolvedValue({ id: 1 });

            // Mock update để trả về false (nghĩa là update không thành công)
            (sessionService.update as jest.Mock).mockResolvedValue(false);

            await expect(service.logout({} as TTokenData)).rejects.toThrow(new BadRequestException("The session can't delete"));
        });

        it('should return success response if session is deleted successfully', async () => {
            // Mock findByTokenData để trả về một session hợp lệ
            (sessionService.findByTokenData as jest.Mock).mockResolvedValue({ id: 1 });

            // Mock update để trả về true (nghĩa là update thành công)
            (sessionService.update as jest.Mock).mockResolvedValue(true);

            const result = await service.logout({} as TTokenData);

            expect(result).toEqual(
                expect.objectContaining({
                    data: true,
                    message: 'Logout successfully',
                    status_code: 200,
                }),
            );
        });
    });

    describe('getCurrentAdminProfile', () => {
        it('should throw NotFoundException if payload class is not ADMIN not found', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.CUSTOMER, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(null);

            await expect(service.getCurrentAdminProfile(tokenData)).rejects.toThrow(
                new NotFoundException(
                    KtqResponse.toResponse(null, {
                        message: 'The admin not found',
                        status_code: HttpStatus.NOT_FOUND,
                    }),
                ),
            );
        });

        it('should throw NotFoundException if admin not found', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.ADMIN, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(null);

            await expect(service.getCurrentAdminProfile(tokenData)).rejects.toThrow(
                new NotFoundException(
                    KtqResponse.toResponse(null, {
                        message: 'The admin not found',
                        status_code: HttpStatus.NOT_FOUND,
                    }),
                ),
            );
        });

        it('should return admin profile if admin exists', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.ADMIN, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            const mockAdmin = {
                id: 123,
                username: 'adminUser',
                email: 'admin@example.com',
                // Thêm các thuộc tính khác nếu cần
            } as KtqAdminUser;
            jest.spyOn(adminUserService, 'findOne').mockResolvedValue(mockAdmin);

            const result = await service.getCurrentAdminProfile(tokenData);

            expect(result).toEqual(KtqResponse.toResponse(mockAdmin, { message: 'Profile was got' }));
        });
    });

    describe('getCustomerProfile', () => {
        it('should throw NotFoundException if payload class is not CUSTOMER not found', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.CUSTOMER, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            jest.spyOn(customerService, 'findOne').mockResolvedValue(null);

            await expect(service.getCurrentCustomerProfile(tokenData)).rejects.toThrow(
                new NotFoundException(
                    KtqResponse.toResponse(null, {
                        message: 'The customer not found',
                        status_code: HttpStatus.NOT_FOUND,
                    }),
                ),
            );
        });

        it('should throw NotFoundException if customer not found', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.ADMIN, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            jest.spyOn(customerService, 'findOne').mockResolvedValue(null);

            await expect(service.getCurrentCustomerProfile(tokenData)).rejects.toThrow(
                new NotFoundException(
                    KtqResponse.toResponse(null, {
                        message: 'The customer not found',
                        status_code: HttpStatus.NOT_FOUND,
                    }),
                ),
            );
        });

        it('should return customer profile if customer exists', async () => {
            const tokenData: TTokenData = { id: 123, class: UserRoleType.CUSTOMER, session_key: 'session_key', exp: new Date().getTime(), iat: new Date().getTime() }; // Giả định token data

            const mockAdmin = {
                id: 123,
                username: 'adminUser',
                email: 'admin@example.com',
            } as KtqCustomer;
            jest.spyOn(customerService, 'findOne').mockResolvedValue(mockAdmin);

            const result = await service.getCurrentCustomerProfile(tokenData);

            expect(result).toEqual(KtqResponse.toResponse(mockAdmin, { message: 'Profile was got' }));
        });
    });

    describe('customerRegister', () => {
        it('should successfully register a new customer and return response', async () => {
            const dto: RegisterKtqCustomerDto = {
                username: 'newCustomer',
                password: 'securePassword',
                email: 'customer@example.com',
            };

            // Giả lập hành động tạo mới khách hàng
            const mockCustomer = {
                id: 1,
                ...dto,
                password: 'hashedPassword', // Không cần giá trị thật ở đây
                created_at: new Date(),
                updated_at: new Date(),
            } as KtqCustomer;

            jest.spyOn(customerService, 'create').mockResolvedValue(mockCustomer); // Giả lập service trả về khách hàng đã được tạo

            const result = await service.customerRegister(dto);

            expect(result).toEqual(
                expect.objectContaining({
                    ...KtqResponse.toResponse(plainToClass(KtqAdminUser, mockCustomer)),
                    timestamp: expect.any(String),
                }),
            );
        });

        it('should throw an error if creating customer fails', async () => {
            const dto: RegisterKtqCustomerDto = {
                username: 'newCustomer',
                password: 'securePassword',
                email: 'customer@example.com',
            };

            // Giả lập hành động tạo mới khách hàng không thành công
            jest.spyOn(customerService, 'create').mockRejectedValue(new Error('Error creating customer')); // Giả lập lỗi khi tạo khách hàng

            await expect(service.customerRegister(dto)).rejects.toThrow(new Error('Error creating customer'));
        });
    });
});
