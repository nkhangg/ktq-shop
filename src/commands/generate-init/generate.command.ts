// ts-node src/commands/generate-model/index.ts generate
import axios, { AxiosError } from 'axios';
import KtqAppConstant from '../../constants/ktq-app.constant';
import KtqConfigConstant from '../../constants/ktq-configs.constant';
import GenerateBase from '../generate-base';
export default class GenerateCommand extends GenerateBase {
    private token = null;

    public async login() {
        try {
            const { username, password } = KtqAppConstant.getRootUserData();

            const response = await axios({
                method: 'POST',
                url: `${KtqConfigConstant.getHostname()}/admin/auth/login`,
                data: {
                    username,
                    password,
                },
            });

            if (response && response.data?.token) {
                this.token = response.data.token;
            }
        } catch (error) {
            console.log((error as AxiosError).response.data);
            console.log('error went login');
        }
    }

    public async logout() {
        const response = await axios({
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
            },
            url: `${KtqConfigConstant.getHostname()}/admin/auth/logout`,
        });

        if (response.status !== 200) {
            return;
        }

        this.token = null;
    }

    public async generateRoles() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/roles/init-roles`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            console.log(`Initialize roles success: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async generateConfigs() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/configs/init-configs`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            console.log(`Initialize configs success: ${JSON.stringify(response.data)}`);
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async generateRootUser() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/admin-users/init-configs`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Initialize root user success`);
            } else {
                console.log(`Initialize root user failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async importResources() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/resources/import-resource`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Import resource success`);
            } else {
                console.log(`Import resource failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async initPermissions() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/permissions/init-permissions`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Initialize permissions success`);
            } else {
                console.log(response.data);
                console.log(`Initialize permissions failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async initRolePermissions() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/role-permissions/init-role-permissions`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Initialize role permissions success`);
            } else {
                console.log(response.data);
                console.log(`Initialize role permissions failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async initRoleResources() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/role-resources/init-role-resources`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Initialize role resources success`);
            } else {
                console.log(response.data);
                console.log(`Initialize role resources failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async initCustomerGroups() {
        try {
            const response = await axios({
                method: 'post',
                url: `${KtqConfigConstant.getHostname()}/admin/customer-groups/init-customer-groups`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                },
            });
            if (response.data) {
                console.log(`Initialize customer groups success`);
            } else {
                console.log(response.data);
                console.log(`Initialize customer groups failure`);
            }
        } catch (error) {
            console.error(`Lỗi khi gọi API: ${error.message}`);
        }
    }

    public async generateInit() {
        await this.login();

        if (!this.token) {
            console.log('The Initialize failure. Because login to app failure');
            return;
        }

        await this.generateRoles();
        await this.generateConfigs();
        await this.generateRootUser();
        await this.initPermissions();
        await this.importResources();
        await this.initRolePermissions();
        await this.initRoleResources();
        await this.initCustomerGroups();
        await this.logout();
    }
}
