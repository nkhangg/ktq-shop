// ts-node src/commands/generate-model/index.ts generate
import * as fs from 'fs';
import { join } from 'path';
import GenerateBase, { Relation, TableDefinition } from '../generate-base';
import { execSync } from 'child_process';
import { table } from 'console';

// import KtqConfig from '@/entities/ktq-configs.entity';
// import { ServiceInterface } from '@/services/service-interface';
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// interface CreateConfigDto {
//     key_name: string;
//     key_type: string;
//     key_value: string;
// }

// @Injectable()
// export class KtqConfigsService implements ServiceInterface<KtqConfig, CreateConfigDto> {
//     constructor(
//         @InjectRepository(KtqConfig)
//         private readonly ktqConfigRepository: Repository<KtqConfig>,
//     ) {}

//     async create(configData: CreateConfigDto): Promise<KtqConfig> {
//         const ktqConfig = this.ktqConfigRepository.create(configData);
//         return this.ktqConfigRepository.save(ktqConfig);
//     }

//     async findAll(): Promise<KtqConfig[]> {
//         return this.ktqConfigRepository.find();
//     }

//     async findOne(id: number): Promise<KtqConfig> {
//         return this.ktqConfigRepository.findOneBy({ id });
//     }

//     async update(id: number, configData: CreateConfigDto): Promise<KtqConfig> {
//         await this.ktqConfigRepository.update(id, configData);
//         return this.findOne(id);
//     }

//     async delete(id: number): Promise<void> {
//         await this.ktqConfigRepository.delete(id);
//     }

//     async getConfig(key_name: string): Promise<KtqConfig> {
//         const config = await this.ktqConfigRepository.findOneBy({ key_name });
//         if (!config) {
//             return null;
//         }
//         return config;
//     }
// }

export default class GenerateCommand extends GenerateBase {
    private moduleFolder = join(__dirname, '../../modules');
    private schemaFilePath = join(__dirname, '../../etc/db_schemas.dbml');
    private dtosDir = join(__dirname, '../../common/dtos');
    private moduleName = 'ktq-products';
    private modelName = 'KtqProduct';

    setModuleName(moduleName: string) {
        this.moduleName = moduleName;
    }

    setModelName(modelName: string) {
        this.modelName = modelName;
    }

    isExistsModule(moduleName: string): boolean {
        const modulePath = join(this.moduleFolder, `${moduleName}`);
        return fs.existsSync(modulePath);
    }

    createImportModel() {
        return ``;
    }

    createImportDefault() {
        return `
        import { ServiceInterface } from '@/services/service-interface';
        import { Injectable } from '@nestjs/common';
        import { InjectRepository } from '@nestjs/typeorm';
        import { Repository } from 'typeorm';
        `;
    }

    createServiceImports(table: TableDefinition) {
        const classnames = this.toSingular(this.convertTableNameToClassName(table.name));
        const filename = table.name.replaceAll('_', '-');

        return `
        import General${classnames}Dto from "@/common/dtos/${filename}.dto";
        import ${classnames} from "@/entities/${filename}.entity";
        `;
    }

    createClassnameService() {
        const serviceName = `${this.toPlural(this.modelName)}_service`;

        return this.convertTableNameToClassName(serviceName);
    }

    createRepositoryVariableName() {
        return this.lowerCaseFirstLetter(this.convertTableNameToClassName(`${this.modelName}_repository`));
    }

    getTableFromModelName(tables: TableDefinition[]) {
        return tables.find((item) => this.convertTableNameToClassName(this.toSingular(item.name)) === this.modelName) || null;
    }

    getInvalidDtoField(table: TableDefinition) {
        const fields = table.fields;

        const invalidColumn = ['created_at', 'updated_at', 'id'];

        return fields.filter((item) => !invalidColumn.includes(item.name));
    }

    createDto(table: TableDefinition) {
        const columns = this.getInvalidDtoField(table);

        const columnsStr = columns.reduce((prev, cur) => {
            return (prev += `${cur.name}: ${this.mapSqlDataTypeToJs(cur.type.type_name)};`);
        }, '');

        return `
           export default  interface General${this.convertTableNameToClassName(this.modelName)}Dto {
                ${columnsStr}
            }
        `;
    }

    saveDtoFile(item: TableDefinition, template: string) {
        const filePath = join(this.dtosDir, `${item.name.replaceAll('_', '-')}.dto.ts`);

        // if (fs.existsSync(filePath)) {
        //     console.log(`File ${filePath} đã tồn tại. Ghi đè lên file này. \n`);
        // }

        fs.writeFileSync(filePath, template);
        // console.log(`File ${filePath} đã được tạo thành công. \n`);

        // Format file bằng Prettier
        this.formatFileSync(filePath);

        // this.addEntityToModule(item.name);
    }

    createModule(table: TableDefinition) {
        try {
            const modulePath = `./modules/${table.name.replaceAll('_', '-')}`;
            execSync(`nest generate module ${modulePath}`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error create module file: ${error.message} \n`);
        }
    }

    createService(table: TableDefinition) {
        try {
            execSync(`nest generate service ./modules/${table.name.replaceAll('_', '-')}`, { stdio: 'inherit' });
        } catch (error) {
            console.error(`Error create service file: ${error.message} \n`);
        }
    }

    saveServiceFile(table: TableDefinition) {
        const serviceFilePath = join(this.moduleFolder, `${this.moduleName}/${table.name.replaceAll('_', '-')}.service.ts`);

        const template = this.createTemplate(table);

        fs.writeFileSync(serviceFilePath, template);
        // console.log(`File ${filePath} đã được tạo thành công. \n`);

        // Format file bằng Prettier
        this.formatFileSync(serviceFilePath);
    }

    createTemplate(table: TableDefinition) {
        const classnames = this.toSingular(this.convertTableNameToClassName(table.name));

        const repoVariable = this.createRepositoryVariableName();

        const paramVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.toSingular(this.removePrefix(table.name))));
        const modelVariable = this.lowerCaseFirstLetter(this.toSingular(this.convertTableNameToClassName(table.name)));

        return `
        ${this.createServiceImports(table)}
        ${this.createImportDefault()}

        @Injectable()
        export class ${this.createClassnameService()} implements ServiceInterface<${this.modelName}, General${classnames}Dto> {
            constructor(
                @InjectRepository(${this.modelName})
                private readonly ${repoVariable}: Repository<${this.modelName}>,
            ) {}

            async create(${paramVariable}: General${classnames}Dto): Promise<${this.modelName}> {
                const ${modelVariable} = this.${repoVariable}.create(${paramVariable});
                return this.${repoVariable}.save(${modelVariable});
            }

            async findAll(): Promise<${this.modelName}[]> {
                return this.${repoVariable}.find();
            }

            async findOne(id: ${this.modelName}['id']): Promise<${this.modelName}> {
                return this.${repoVariable}.findOneBy({ id });
            }

            async update(id: ${this.modelName}['id'], ${paramVariable}: General${classnames}Dto): Promise<${this.modelName}> {
                await this.${repoVariable}.update(id, ${paramVariable});
                return this.findOne(id);
            }

            async delete(id: ${this.modelName}['id']): Promise<void> {
                await this.${repoVariable}.delete(id);
            }
        }
        `;
    }

    generateService() {
        const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = data['schemas'][0]['tables'];
        const refs: Relation[] = data['schemas'][0]['refs'];

        const table = this.getTableFromModelName(tables);

        if (!table) {
            console.error('The model not exits in schema file.');
            return;
        }

        if (!this.isExistsModule(this.moduleName)) {
            this.createModule(table);
            this.createService(table);
        }

        const dtoTemplate = this.createDto(table);

        this.saveDtoFile(table, dtoTemplate);

        this.saveServiceFile(table);
    }
}
