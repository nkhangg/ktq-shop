// ts-node src/commands/generate-model/index.ts generate
import { exec } from 'child_process';
import GenerateBase from '../generate-base';
import KtqConfigConstant from '../../constants/ktq-configs.constant';

export default class GenerateCommand extends GenerateBase {
    public async generateRoles() {
        const curlCommand = `curl -X POST "${KtqConfigConstant.getHostname()}/ktq-roles/init-roles"`;

        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Lỗi khi gọi API: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`Initialize roles success`);
                return;
            }
        });
    }

    public async generateConfigs() {
        const curlCommand = `curl -X POST "${KtqConfigConstant.getHostname()}/ktq-configs/init-configs"`;

        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Lỗi khi gọi API: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`Initialize configs success`);
                return;
            }
        });
    }

    public async generateRootUser() {
        const curlCommand = `curl -X POST "${KtqConfigConstant.getHostname()}/ktq-admin-users/init-configs"`;

        exec(curlCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`Lỗi khi gọi API: ${error.message}`);
                return;
            }
            if (stderr) {
                const response = JSON.parse(stdout);
                if (response.data) {
                    console.log(`Initialize root user success`);
                } else {
                    console.log(`Initialize root user failure`);
                }
                return;
            }
        });
    }

    public async generateInit() {
        await this.generateRoles();
        await this.generateConfigs();
        await this.generateRootUser();
    }
}
