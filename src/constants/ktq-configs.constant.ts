import { KtqConfigsService } from '@/modules/ktq-configs/ktq-configs.service';
import { KeyType } from '../common/enums/key-type.enum';
import KtqConfig from '../entities/ktq-configs.entity';

export default class KtqConfigConstant {
    public static CONFIG_APP_HOST = 'app-host';
    public static CONFIG_APP_PORT = 'app-port';
    public static CONFIG_APP_API_PREFIX = 'app-api-prefix';
    public static CONFIG_APP_API_VERSION = 'app-api-version';
    public static CONFIG_APP_CLIENT_APP_URL = 'app-client-app-url';
    public static CONFIG_APP_CORS_SOURCES = 'app-cors-sources';

    constructor(private readonly ktqConfigService: KtqConfigsService) {}

    public static getConfigs() {
        return [
            {
                id: 1,
                key_name: this.CONFIG_APP_HOST,
                key_type: KeyType.STRING,
                key_value: 'http://localhost',
            },
            {
                id: 2,
                key_name: this.CONFIG_APP_PORT,
                key_type: KeyType.STRING,
                key_value: '4000',
            },
            {
                id: 3,
                key_name: this.CONFIG_APP_API_PREFIX,
                key_type: KeyType.STRING,
                key_value: 'api',
            },
            {
                id: 4,
                key_name: this.CONFIG_APP_API_VERSION,
                key_type: KeyType.STRING,
                key_value: 'v1',
            },
            {
                id: 5,
                key_name: this.CONFIG_APP_CLIENT_APP_URL,
                key_type: KeyType.STRING,
                key_value: 'http://localhost:3000/forgot-password',
            },
            {
                id: 6,
                key_name: this.CONFIG_APP_CORS_SOURCES,
                key_type: KeyType.JSON,
                key_value: JSON.stringify(['http://localhost:3000', 'http://localhost:5173']),
            },
        ] as KtqConfig[];
    }

    public getTest() {
        return this.ktqConfigService.findOneWith({
            where: {
                key_name: 'app-host',
            },
        });
    }

    public static getAppHost() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_HOST);
    }

    public static getAppPort() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_PORT);
    }

    public static getApiPrefix() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_API_PREFIX);
    }

    public static getApiVersion() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_API_VERSION);
    }

    public static getConfigByKey(key: string) {
        return this.getConfigs().find((item) => item.key_name === key);
    }

    public static getVersionPrefix() {
        return `/${this.getApiPrefix().key_value}/${this.getApiVersion().key_value}`;
    }

    public static getCorsSources() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_CORS_SOURCES);
    }

    public static getHostname() {
        return `${this.getAppHost().key_value}:${this.getAppPort().key_value}/${this.getApiPrefix().key_value}/${this.getApiVersion().key_value}`;
    }

    public static getMediaPath(mediasPath?: string, host = false) {
        if (host) {
            return `${this.getAppHost().key_value}:${this.getAppPort().key_value}/medias/${mediasPath ? `${mediasPath}` : ''}`;
        }

        return `medias/${mediasPath ? `${mediasPath}` : ''}`;
    }

    public static getCustomerMediaPath(filename: string, type: 'avatar' | 'cover' = 'avatar', host = false) {
        return this.getMediaPath(`customer/${type}/${filename}`, host);
    }
    public static getClientAppUrl() {
        return this.getConfigs().find((item) => item.key_name === this.CONFIG_APP_CLIENT_APP_URL);
    }
}
