import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';
import { KtqAuthenticationsService } from '../ktq-authentications.service';
import axios, { AxiosError, HttpStatusCode } from 'axios';
import KtqConfigConstant from '@/constants/ktq-configs.constant';
import KtqAppConstant from '@/constants/ktq-app.constant';
import { KtqAdminUsersService } from '@/modules/ktq-admin-users/ktq-admin-users.service';
import KtqRolesConstant from '@/constants/ktq-roles.constant';

describe('KtqAdminAuthenticationsController', () => {
    let app: INestApplication;
    let service: KtqAdminUsersService;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            providers: [
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
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
        await app.init();
        service = moduleFixture.get<KtqAdminUsersService>(KtqAdminUsersService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/admin/auth/login [POST]', () => {
        it('should return 400 if username is empty', async () => {
            const emptyUsernameDto = { username: '', password: 'password123' };

            await request(app.getHttpServer())
                .post('/admin/auth/login')
                .send(emptyUsernameDto)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toContain('username should not be empty');
                });
        });

        it('should return 400 if username is too short', async () => {
            const shortUsernameDto = { username: 'abc', password: 'password123' };

            await request(app.getHttpServer())
                .post('/admin/auth/login')
                .send(shortUsernameDto)
                .expect(400)
                .expect((res) => {
                    expect(res.body.message).toContain('username must be longer than or equal to 4 characters');
                });
        });

        it('should return 200 and token if login is successful', async () => {
            const validLoginDto = { username: 'admin', password: 'Admin@123' };

            // Giả lập phản hồi thành công
            jest.spyOn(app.get(KtqAuthenticationsService), 'adminLogin').mockResolvedValue('mockToken');

            await request(app.getHttpServer())
                .post('/admin/auth/login')
                .send(validLoginDto)
                .expect(200)
                .expect((res) => {
                    expect(res.text).toBe('mockToken');
                });
        });
    });

    describe('/admin/auth/register [POST]', () => {
        it('should return 400 if username is empty', async () => {
            const emptyUsernameDto = { username: '', password: 'password123' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('username should not be empty');
            }
        });

        it('should return 400 if username is too short', async () => {
            const emptyUsernameDto = { username: 'abc', password: 'password123' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('username must be longer than or equal to 4 characters');
            }
        });

        it('should return 400 if username is not unique', async () => {
            const rootAdmin = KtqAppConstant.getRootUserData();

            const emptyUsernameDto = { username: rootAdmin.username, password: 'password123' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('username admin already exists');
            }
        });

        it('should return 400 if email is empty', async () => {
            const emptyUsernameDto = { username: '', password: 'password123', email: '' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('email must be an email');
            }
        });

        it('should return 400 if email is invalid', async () => {
            const emptyUsernameDto = { username: 'abc', password: 'password123', email: 'abcd' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('email must be an email');
            }
        });

        it('should return 400 if email is not unique', async () => {
            const rootAdmin = KtqAppConstant.getRootUserData();

            const emptyUsernameDto = { username: rootAdmin.username, password: 'password123', email: rootAdmin.email };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain(`email ${rootAdmin.email} already exists`);
            }
        });

        it('should return 400 if role_id is empty', async () => {
            const emptyUsernameDto = { username: '', password: 'password123', email: '', role_id: '' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('username should not be empty');
            }
        });

        it('should return 400 if role_id is invalid', async () => {
            const emptyUsernameDto = { username: 'abc', password: 'password123', email: 'abcd', role_id: 'abc' };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;

                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('role_id must be a number conforming to the specified constraints');
            }
        });

        it('should return 400 if role_id is not found', async () => {
            const rootAdmin = KtqAppConstant.getRootUserData();

            const emptyUsernameDto = { username: rootAdmin.username, password: 'password123', email: rootAdmin.email, role_id: 100 };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                expect(JSON.stringify(axiosError.response.data)).toContain('id 100 is not found');
            }
        });

        it('should return 400 if role_id is root admin', async () => {
            const emptyUsernameDto = { username: 'test', password: 'password123', email: 'test@gmail.com', role_id: KtqRolesConstant.getSuperAdmin().id };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                console.log(axiosError.response.data['errors']);
                expect(JSON.stringify(axiosError.response.data)).toContain('The role is not allowed to set up this account');
            }
        });

        it('should return 400 if password is not empty', async () => {
            const rootAdmin = KtqAppConstant.getRootUserData();

            const emptyUsernameDto = { username: rootAdmin.username, password: '', email: rootAdmin.email, role_id: 100 };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                console.log(axiosError.response.data['errors']);
                expect(JSON.stringify(axiosError.response.data)).toContain('password should not be empty');
            }
        });

        it('should return 400 if password too short', async () => {
            const rootAdmin = KtqAppConstant.getRootUserData();

            const emptyUsernameDto = { username: rootAdmin.username, password: '', email: rootAdmin.email, role_id: 100 };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.BadRequest);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.BadRequest);
                console.log(axiosError.response.data['errors']);
                expect(JSON.stringify(axiosError.response.data)).toContain('password must be longer than or equal to 6 characters');
            }
        });

        it('should return 200 if register success', async () => {
            const emptyUsernameDto = { username: 'test', password: 'test@test', email: 'test@gmail.com', role_id: KtqRolesConstant.getManagement().id };

            try {
                const response = await axios({
                    method: 'POST',
                    data: emptyUsernameDto,
                    url: `${KtqConfigConstant.getHostname()}/admin/auth/register`,
                });

                expect(response.status).toBe(HttpStatusCode.Ok);
            } catch (error) {
                const axiosError = error as AxiosError;
                expect(axiosError.response.status).toBe(HttpStatusCode.Ok);
            }
        });
    });
});
