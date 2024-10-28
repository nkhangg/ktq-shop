// ts-node src/commands/generate-model/index.ts generate
import * as fs from 'fs';
import { join } from 'path';
import GenerateBase, { Relation, TableDefinition } from '../generate-base';
import { execSync } from 'child_process';
import { table } from 'console';
export default class GenerateCommand extends GenerateBase {
    private moduleFolder = join(__dirname, '../../modules');
    private schemaFilePath = join(__dirname, '../../etc/db_schemas.dbml');
    private dtosDir = join(__dirname, '../../common/dtos');
    private outputDir = join(__dirname, '../../entities');

    private moduleName = 'ktq-products';
    private modelName = 'KtqProduct';
    private tables: TableDefinition[] = [];
    private refs: Relation[] = [];

    constructor() {
        super();
        const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = data['schemas'][0]['tables'];
        const refs: Relation[] = data['schemas'][0]['refs'];

        this.tables = tables;
        this.refs = refs;
    }

    setModuleName(moduleName: string) {
        this.moduleName = moduleName;
    }

    setModelName(modelName: string) {
        this.modelName = modelName;
    }

    setSchemaFilePath(filename: string) {
        this.schemaFilePath = join(__dirname, `../../etc/${filename}`);
    }

    isExistsModule(moduleName: string): boolean {
        const modulePath = join(this.moduleFolder, `${moduleName}`);
        return fs.existsSync(modulePath);
    }

    existsTable(tablename: string) {
        const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = data['schemas'][0]['tables'];

        return tables.find((item) => item.name === tablename) || null;
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
        //import General${classnames}Dto from "@/common/dtos/${filename}.dto";
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
            return (prev += `${cur.name}${cur.dbdefault ? '?' : ''}: ${this.isEnum(cur) ? this.createEnumName(cur) : this.mapSqlDataTypeToJs(cur.type.type_name)};`);
        }, '');

        return `

        ${this.existEnum(table.fields) ? this.createEnumImports(table.fields, '../enums') : ''}

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

    addRepository(table: TableDefinition) {
        const folderName = table.name.replaceAll('_', '-');
        const filePath = join(this.moduleFolder, `/${folderName}/${folderName}.module.ts`);

        let fileContent = fs.readFileSync(filePath, 'utf8');

        const entityImportPath = `@/entities/${folderName}.entity`;

        const importStatement = `import ${this.modelName} from '${entityImportPath}';\n`;
        const importTypeORM = `import { TypeOrmModule } from '@nestjs/typeorm';\n`;

        if (!fileContent.includes(entityImportPath)) {
            fileContent = importStatement + fileContent;
        }

        if (!fileContent.includes(importTypeORM)) {
            fileContent = importTypeORM + fileContent;
        }

        if (fileContent.includes(`TypeOrmModule.forFeature([${this.modelName}])]`)) {
            return;
        }

        fileContent = fileContent.replace(/@Module\(\{([\s\S]*?)\}\)/, (match, group) => {
            if (group.includes('imports:')) {
                return match.replace(/imports:\s*\[([\s\S]*?)\]/, (importsMatch, importsGroup) => {
                    return `imports: [${importsGroup}, TypeOrmModule.forFeature([${this.modelName}])]`;
                });
            } else {
                return `@Module({\n  imports: [TypeOrmModule.forFeature([${this.modelName}])],${group}\n})`;
            }
        });

        fs.writeFileSync(filePath, fileContent, 'utf8');
    }

    createTemplate(table: TableDefinition) {
        const classnames = this.toSingular(this.convertTableNameToClassName(table.name));

        const repoVariable = this.createRepositoryVariableName();

        const paramVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.toSingular(this.removePrefix(table.name))));
        const modelVariable = this.lowerCaseFirstLetter(this.toSingular(this.convertTableNameToClassName(table.name)));

        const primaryKey = this.getPrimaryKey(table.fields);

        return `
        ${this.createServiceImports(table)}
        ${this.createImportDefault()}

        @Injectable()
        export class ${this.createClassnameService()} implements ServiceInterface<${this.modelName}, Partial<${this.modelName}>> {
            constructor(
                @InjectRepository(${this.modelName})
                private readonly ${repoVariable}: Repository<${this.modelName}>,
            ) {}

            async create(${paramVariable}: Partial<${this.modelName}>): Promise<${this.modelName}> {
                const ${modelVariable} = this.${repoVariable}.create(${paramVariable});
                return this.${repoVariable}.save(${modelVariable});
            }

            async findAll(): Promise<${this.modelName}[]> {
                return this.${repoVariable}.find();
            }

            async findOne(id: ${this.modelName}['${primaryKey.name}']): Promise<${this.modelName}> {
                return this.${repoVariable}.findOneBy({ id });
            }

            async update(id: ${this.modelName}['${primaryKey.name}'], ${paramVariable}: Partial<${this.modelName}>): Promise<${this.modelName}> {
                await this.${repoVariable}.update({id}, ${paramVariable});
                return this.findOne(id);
            }

            async delete(id: ${this.modelName}['${primaryKey.name}']): Promise<void> {
                await this.${repoVariable}.delete(id);
            }
        }
        `;
    }

    generateServiceWithTableName(tableName: string) {
        if (!this.existsTable(tableName)) {
            console.error('The table name not exits');
            return;
        }

        this.setModuleName(tableName.replaceAll('_', '-'));

        this.setModelName(this.toSingular(this.convertTableNameToClassName(tableName)));

        this.generateService();
    }

    generateServiceWithModelName(modelName: string) {
        this.setModelName(modelName);
        this.setModuleName(this.camelToSnakeCase(this.toPlural(modelName)).replaceAll('_', '-'));

        this.generateService();
    }

    generateService() {
        const table = this.getTableFromModelName(this.tables);

        if (!table) {
            console.error('The model not exits in schema file.');
            return;
        }

        if (!this.fileExists(join(this.outputDir, `/${table.name.replaceAll('_', '-')}.entity.ts`))) {
            console.error('Model file not exits in entities folder');
            return;
        }

        if (!this.isExistsModule(this.moduleName)) {
            this.createModule(table);
            this.createService(table);
        }

        const dtoTemplate = this.createDto(table);

        this.addRepository(table);

        this.saveDtoFile(table, dtoTemplate);

        this.saveServiceFile(table);
    }
}
