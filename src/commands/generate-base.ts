import * as pluralize from 'pluralize';
import * as fs from 'fs';
import { execSync } from 'child_process';
import { ModelExporter, Parser } from '@dbml/core';

export interface Field {
    name: string;
    type: {
        schemaName: string | null;
        type_name: string;
        args: any | null;
    };
    pk?: boolean;
    unique?: boolean;
    not_null?: boolean;
    note?: string | null;
    dbdefault?: {
        type: string;
        value: any;
    };
}

export interface TableDefinition {
    name: string;
    alias: string | null;
    note: string | null;
    fields: Field[];
    indexes: any[];
}

export interface Endpoint {
    schemaName: string | null;
    tableName: string;
    fieldNames: string[];
    relation: '1' | '*'; // Quan hệ 1-1 hoặc 1-nhiều
}

export interface Relation {
    name: string | null;
    endpoints: Endpoint[];
}
export default class GenerateBase {
    private parserDbml = new Parser();

    getParser() {
        return this.parserDbml;
    }

    toSingular(word: string): string {
        return pluralize(word, 1);
    }

    lowerCaseFirstLetter(str: string): string {
        return str.charAt(0).toLowerCase() + str.slice(1);
    }

    toPlural(word: string): string {
        return pluralize(word);
    }

    removePrefix(word: string, prefix = 'ktq_') {
        return word.replaceAll(prefix, '');
    }

    existsClass(className: string, path: string) {
        try {
            const module = require(path);

            if (className in module) {
                return module[className];
            } else {
                return null;
            }
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    fileExists(filePath: string) {
        try {
            // Kiểm tra file với fs.accessSync
            fs.accessSync(filePath, fs.constants.F_OK);
            return true; // File tồn tại
        } catch (err) {
            return false; // File không tồn tại
        }
    }

    formatFileSync(filePath: string) {
        try {
            execSync(`npx prettier --write ${filePath}`, { stdio: 'inherit' });
            // console.log(`File ${filePath} đã được format thành công. \n`);
        } catch (error) {
            console.error(`Error formatting file: ${error.message} \n`);
        }
    }

    getAllFileNames(directoryPath: string) {
        try {
            // Đọc nội dung của thư mục
            const files = fs.readdirSync(directoryPath);

            // Trả về danh sách tên file
            return files;
        } catch (error) {
            console.error(`Lỗi khi đọc thư mục: ${error.message}`);
            return [];
        }
    }

    convertFilenameToClassName(fileName: string) {
        return this.toSingular(
            fileName
                .split('-')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join('')
                .split('.')[0],
        );
    }

    convertTableNameToClassName(tableName: string): string {
        return tableName
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }

    extractType(dataType: string) {
        return dataType.split('(')[0];
    }

    getDataFormDbml(pahtName: string) {
        const dbml = fs.readFileSync(pahtName, 'utf-8');
        const database = this.parserDbml.parse(dbml, 'dbml');

        // Export Database object to PostgreSQL
        const jsonSQL = ModelExporter.export(database, 'json', false);
        const data = JSON.parse(jsonSQL.toString());

        return data;
    }

    mapSqlDataTypeToJs(sqlType: string, callback?: () => string): string {
        switch (this.extractType(sqlType.toLowerCase())) {
            case 'integer':
            case 'int':
            case 'bigint':
                return 'number'; // Mapped to JavaScript number
            case 'varchar':
            case 'text':
            case 'char':
            case 'string':
                return 'string'; // Mapped to JavaScript string
            case 'boolean':
            case 'bool':
                return 'boolean'; // Mapped to JavaScript boolean
            case 'date':
            case 'timestamp':
                return 'Date'; // Mapped to JavaScript Date object
            case 'float':
            case 'double':
                return 'number'; // Mapped to JavaScript number
            case 'json':
                return 'object'; // Mapped to JavaScript object
            case 'enum':
                return (callback && callback()) || 'string'; // Mapped to JavaScript string (enums are usually represented as strings)
            default:
                console.log(sqlType);
                throw new Error(`Unsupported SQL type: ${sqlType}`);
        }
    }
}
