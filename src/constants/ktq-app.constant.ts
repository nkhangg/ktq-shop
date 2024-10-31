import { join, resolve } from 'path';
import * as fs from 'fs';

export default class KtqAppConstant {
    public static DB_SCHEMA_FILE_NAME = 'db_schemas.dbml';

    public static DB_CONFIG_APP_NAME = 'config-app.json';

    public static CONFIG_ROOT_USER_KEY = 'root-user';

    public static ROOT_DIRECTORY = resolve(__dirname, '../');

    public static etcFilePath = (etc_file: string) => {
        return join(this.ROOT_DIRECTORY, `etc/${etc_file}`);
    };

    public static DB_SCHEMA_PATH = this.etcFilePath(this.DB_SCHEMA_FILE_NAME);
    public static DB_CONFIG_APP_PATH = this.etcFilePath(this.DB_CONFIG_APP_NAME);

    public static getConfigApp = () => {
        try {
            const data = fs.readFileSync(this.DB_CONFIG_APP_PATH.replace('/dist', ''), 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return null;
        }
    };

    public static getRootUserData = () => {
        const data = this.getConfigApp();

        if (!data) return null;

        const { username, password, email } = data[this.CONFIG_ROOT_USER_KEY];

        return { username, password, email };
    };
}
