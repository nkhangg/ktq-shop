import { env } from '../utils/app';
import { join, resolve } from 'path';
import moment from 'moment';

export default class KtqAppConstant {
    public static DB_SCHEMA_FILE_NAME = 'db_schemas.dbml';

    public static DB_CONFIG_APP_NAME = 'config-app.json';

    public static CONFIG_ROOT_USER_USERNAME = 'ROOT_USER_USERNAME';
    public static CONFIG_ROOT_USER_PASSWORD = 'ROOT_USER_PASSWORD';
    public static CONFIG_ROOT_USER_EMAIL = 'ROOT_USER_EMAIL';

    public static CONFIG_WEBSITE_TIMEZONE = 'WEBSITE_TIMEZONE';
    public static CONFIG_WEBSITE_CURRENCY = 'WEBSITE_CURRENCY';

    public static CONFIG_REDIS_HOST = 'REDIS_HOST';
    public static CONFIG_REDIS_PORT = 'REDIS_PORT';
    public static CONFIG_REDIS_TTL = 'REDIS_TTL';

    public static CONFIG_TTL_TOKEN = 'TTL_TOKEN';
    public static CONFIG_TTL_TOKEN_UNIT = 'TTL_TOKEN_UNIT';
    public static CONFIG_TTL_REFRESH_TOKEN = 'TTL_REFRESH_TOKEN';
    public static CONFIG_TTL_REFRESH_TOKEN_UNIT = 'TTL_REFRESH_TOKEN_UNIT';
    public static CONFIG_TTL_RESET_LINK = 'TTL_RESET_LINK';
    public static CONFIG_TTL_RESET_LINK_UNIT = 'TTL_RESET_LINK_UNIT';

    public static ROOT_DIRECTORY = resolve(__dirname, '../');

    public static MEDIA_PATH = 'public';
    public static CUSTOMER_MEDIA_PATH = 'customers';

    public static etcFilePath = (etc_file: string) => {
        return join(this.ROOT_DIRECTORY, `etc/${etc_file}`);
    };

    public static customerMediaFilePath = (filename: string) => {
        const rootDir = process.cwd();

        return join(rootDir, `${this.MEDIA_PATH}/${this.CUSTOMER_MEDIA_PATH}/${filename}`);
    };

    public static DB_SCHEMA_PATH = this.etcFilePath(this.DB_SCHEMA_FILE_NAME);

    public static getRootUserData = () => {
        const username = env(this.CONFIG_ROOT_USER_USERNAME, 'admin');
        const password = env(this.CONFIG_ROOT_USER_PASSWORD, 'Admin@123');
        const email = env(this.CONFIG_ROOT_USER_EMAIL);

        return { username, password, email, id: 1 };
    };

    public static mappingUnit(unit: string): moment.DurationInputArg2 {
        switch (unit) {
            case 's': {
                return 'second';
            }
            case 'h': {
                return 'hour';
            }
            case 'd': {
                return 'day';
            }
            case 'm': {
                return 'minutes';
            }
            default:
                throw new Error(`Don't mapping this ${unit}`);
        }
    }

    public static getTllToken() {
        return {
            ttl: `${env(this.CONFIG_TTL_TOKEN)}${env(this.CONFIG_TTL_TOKEN_UNIT)}`,
            ttl_value: env(this.CONFIG_TTL_TOKEN),
            unit: env(this.CONFIG_TTL_TOKEN_UNIT),
            mapping_unit: this.mappingUnit(env(this.CONFIG_TTL_TOKEN_UNIT, 'h')),
        };
    }
    public static getTllRefreshToken() {
        return {
            ttl: `${env(this.CONFIG_TTL_REFRESH_TOKEN)}${env(this.CONFIG_TTL_REFRESH_TOKEN_UNIT)}`,
            ttl_value: env(this.CONFIG_TTL_REFRESH_TOKEN),
            unit: env(this.CONFIG_TTL_REFRESH_TOKEN_UNIT),
            mapping_unit: this.mappingUnit(env(this.CONFIG_TTL_REFRESH_TOKEN_UNIT, 'h')),
        };
    }

    public static getTllResetLink() {
        return {
            ttl: `${env(this.CONFIG_TTL_RESET_LINK)}${env(this.CONFIG_TTL_RESET_LINK_UNIT)}`,
            ttl_value: env(this.CONFIG_TTL_RESET_LINK),
            unit: env(this.CONFIG_TTL_RESET_LINK_UNIT),
            mapping_unit: this.mappingUnit(env(this.CONFIG_TTL_RESET_LINK_UNIT, 'h')),
        };
    }

    public static getTimeZone() {
        return env(this.CONFIG_WEBSITE_TIMEZONE, 'UTC');
    }
}
