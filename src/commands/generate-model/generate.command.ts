// ts-node src/commands/generate-model/index.ts generate
import { Presets, SingleBar } from 'cli-progress';
import * as fs from 'fs';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import GenerateBase, { Endpoint, Field, Relation, TableDefinition } from '../generate-base';
import KtqAppConstant from '../../constants/ktq-app.constant';

export default class GenerateCommand extends GenerateBase {
    private outputDir = join(__dirname, '../../entities');
    private enumsDir = join(__dirname, '../../common/enums');
    private schemaFilePath = KtqAppConstant.DB_SCHEMA_PATH; // Đặt cứng đường dẫn tới file schema
    // private schemaFilePath = join(__dirname, '../../etc/db_schemas.dbml'); // Đặt cứng đường dẫn tới file schema
    private importPath = {
        timestamp: "import { Timestamp } from '@/common/entities/column/timestamp';",
    };
    private refNames = {
        '1-1': '@OneToOne',
        '*-1': '@ManyToOne',
        '1-*': '@OneToMany',
    };

    private dataDb = {
        refs: [] as Relation[],
        tables: [] as TableDefinition[],
    };

    private excludeKeys = ['password', '_id', 'is_active', 'active'];
    constructor() {
        super();
        // Tạo thư mục nếu chưa tồn tại
        if (!existsSync(this.outputDir)) {
            mkdirSync(this.outputDir);
        }

        this.dataDb = this.getDataDb();
    }

    setSchemaFilePath(filename: string) {
        this.schemaFilePath = join(__dirname, `../../etc/${filename}`);
    }

    createEnumFolder() {
        if (!existsSync(this.enumsDir)) {
            mkdirSync(this.enumsDir);
        }
    }

    getDataDb() {
        const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = data['schemas'][0]['tables'];
        const refs: Relation[] = data['schemas'][0]['refs'];

        return { tables, refs };
    }

    generateModels() {
        // const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = this.dataDb.tables;
        const refs: Relation[] = this.dataDb.refs;

        // Tạo thanh tiến trình
        const progressBar = new SingleBar({}, Presets.shades_classic);

        // Khởi tạo thanh tiến trình với tổng số bảng (tables.length)
        progressBar.start(tables.length, 0);

        tables.forEach((item, index) => {
            const template = this.createTemplate(item, refs);
            this.saveModelFile(item, template);

            progressBar.update(index + 1);
        });

        this.addEntityToModule();

        // Kết thúc thanh tiến trình sau khi xử lý tất cả bảng
        progressBar.stop();
    }

    generateModel(tableName: string) {
        const data = this.getDataFormDbml(this.schemaFilePath);

        const tables: TableDefinition[] = data['schemas'][0]['tables'];
        const refs: Relation[] = data['schemas'][0]['refs'];

        const progressBar = new SingleBar({}, Presets.shades_classic);

        progressBar.start(1, 0);

        const table = tables.find((table) => table.name === tableName);

        if (!table) {
            console.log(`The table name ${tableName} is not exits`);
            return;
        }

        const template = this.createTemplate(table, refs);
        this.saveModelFile(table, template);

        progressBar.update(1);

        this.addEntityToModule();

        progressBar.stop();
    }

    getTableNamesOnRelation(tableName: string, data: Relation[]) {
        const result = data.reduce((acc, item) => {
            if (item.endpoints) {
                const tableNames = item.endpoints.map((endpoint) => endpoint.tableName).filter((name) => name && name !== tableName); // Loại bỏ tên bảng không mong muốn
                return acc.concat(tableNames);
            }
            return acc;
        }, []);
        const uniqueTableNames = [...new Set(result)];

        return uniqueTableNames;
    }

    getRelation(refs: Relation[], item: TableDefinition) {
        return refs.filter((ref) => {
            const data = ref.endpoints.find((i) => i.tableName === item.name);

            return data && data.tableName === item.name;
        });
    }

    createRelation(refs: Relation[], item: TableDefinition) {
        let result = ``;

        const endpoints = this.getRelation(refs, item).map((i) => i.endpoints);

        endpoints.forEach((endpoint) => {
            const typeOrmData = this.mappingRef(this.sortEnpointWithTableName(item.name, endpoint));

            switch (typeOrmData.name) {
                case this.refNames['1-*']:
                    result += this.createOneToMany(item.name, endpoint);
                    break;
                case this.refNames['*-1']:
                    result += this.createManyToOne(item.name, endpoint);
                    break;
                case this.refNames['1-1']:
                    result += this.createOneToOne(item.name, endpoint);
                    break;
            }
        });

        return result;
    }

    sortEnpointWithTableName(tableName: string, endpoint: Endpoint[]) {
        const sortedData = endpoint.sort((a, b) => {
            if (a.tableName === tableName) return -1;
            if (b.tableName === tableName) return 1;
            return 0;
        });

        return [...sortedData];
    }

    createOneToMany(tableName: string, endpoint: Endpoint[]) {
        const consumerItem = endpoint.find((item) => item.tableName !== tableName);
        const producerItem = endpoint.find((item) => item.tableName === tableName);

        if (!consumerItem) return '';

        const consumerName = this.lowerCaseFirstLetter(this.toSingular(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName))));

        const consumerClass = this.toSingular(this.convertTableNameToClassName(consumerItem.tableName));

        const producerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(producerItem.tableName)));
        const consumerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName)));

        return `
                @OneToMany(() => ${consumerClass}, (${consumerName}) => ${consumerName}.${this.toSingular(producerVariable)})
                @Exclude()
                ${this.toPlural(consumerVariable)}: ${consumerClass}[];
                `;
    }

    createManyToOne(tableName: string, endpoint: Endpoint[]) {
        const consumerItem = endpoint.find((item) => item.tableName !== tableName);
        const producerItem = endpoint.find((item) => item.tableName === tableName);

        if (!consumerItem) return '';

        const consumerName = this.lowerCaseFirstLetter(this.toSingular(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName))));

        const consumerClass = this.toSingular(this.convertTableNameToClassName(consumerItem.tableName));

        const producerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(producerItem.tableName)));
        const consumerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName)));

        return `
                @ManyToOne(() => ${consumerClass}, (${consumerName}) => ${consumerName}.${this.toPlural(producerVariable)}, { cascade: true, eager: true })
                @Exclude()
                ${this.toSingular(consumerVariable)}: ${consumerClass};
                `;
    }

    createOneToOne(tableName: string, endpoint: Endpoint[]) {
        const consumerItem = endpoint.find((item) => item.tableName !== tableName);
        const producerItem = endpoint.find((item) => item.tableName === tableName);

        if (!consumerItem) return '';

        const consumerName = this.lowerCaseFirstLetter(this.toSingular(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName))));

        const consumerClass = this.toSingular(this.convertTableNameToClassName(consumerItem.tableName));

        const producerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(producerItem.tableName)));
        const consumerVariable = this.lowerCaseFirstLetter(this.convertTableNameToClassName(this.removePrefix(consumerItem.tableName)));

        const fileExists = this.fileExists(join(this.outputDir, `${consumerItem.tableName.replaceAll('_', '-')}.entity.ts`));

        return `
                @OneToOne(() => ${consumerClass}, (${consumerName}) => ${consumerName}.${this.toSingular(producerVariable)}, ${fileExists ? '' : '{ cascade: true }'})
                @Exclude()
                ${this.toSingular(consumerVariable)}: ${consumerClass};
                `;
    }

    mappingRef(endpoints: Endpoint[]) {
        const key = endpoints.reduce((prev, cur, index) => {
            return (prev += `${cur.relation}${index === endpoints.length - 1 ? '' : '-'}`);
        }, '');

        return { key: key, name: this.refNames[key] };
    }

    createEnum(field: Field) {
        if (!this.isEnum(field)) return '';

        const enums: [] = field.type.args.split(', ');

        const fieldColumn = enums.reduce((pre, cur, index) => {
            return (pre += `${(cur as string).toUpperCase()} = ${cur} ${index === enums.length - 1 ? '' : ','}`);
        }, '');

        const template = `
            export enum ${this.createEnumName(field)} {
                ${fieldColumn}
            }
        `;

        this.createEnumFolder();

        return this.saveEnumFile(field, template);
    }

    createEnums(fields: Field[]) {
        fields.forEach((field) => {
            this.createEnum(field);
        });
    }

    saveModelFile(item: TableDefinition, template: string) {
        const filePath = join(this.outputDir, `${item.name.replaceAll('_', '-')}.entity.ts`);

        // if (fs.existsSync(filePath)) {
        //     console.log(`File ${filePath} đã tồn tại. Ghi đè lên file này. \n`);
        // }

        fs.writeFileSync(filePath, template);
        // console.log(`File ${filePath} đã được tạo thành công. \n`);

        // Format file bằng Prettier
        this.formatFileSync(filePath);

        // this.addEntityToModule(item.name);
    }

    saveEnumFile(field: Field, template: string) {
        const filePath = join(this.enumsDir, `${field.name.replaceAll('_', '-')}.enum.ts`);

        // if (this.fileExists(filePath)) return false;

        // if (fs.existsSync(filePath)) {
        //     console.log(`File ${filePath} đã tồn tại. Ghi đè lên file này. \n`);
        // }

        fs.writeFileSync(filePath, template);
        // console.log(`File ${filePath} đã được tạo thành công. \n`);

        // Format file bằng Prettier
        this.formatFileSync(filePath);
    }

    addEntityToModule() {
        const filePath = join(__dirname, '../../modules/ktq-databases/ktq-databases.module.ts');

        const classnames = this.getAllModelClassnames();
        let fileContent = fs.readFileSync(filePath, 'utf8');

        // Clear all existing import statements that reference '@/entities'
        fileContent = fileContent.replace(/import.*?from\s*['"]@\/entities\/.*?['"];\n/g, '');

        // Clear the existing entities array
        fileContent = fileContent.replace(/entities:\s*\[[^\]]*\]/, 'entities: []');

        const seenClassnames = new Set();
        const uniqueClassnames = classnames.filter((item) => {
            if (seenClassnames.has(item.classname)) {
                return false; // Nếu đã thấy classname này, loại bỏ
            }
            seenClassnames.add(item.classname); // Thêm classname vào Set
            return true; // Giữ lại đối tượng
        });

        uniqueClassnames.forEach((item) => {
            const entityImportPath = `@/entities/${item.original.replace('.ts', '')}`;

            const importStatement = `import ${item.classname} from '${entityImportPath}';\n`;
            fileContent = importStatement + fileContent;
        });

        const entityRegex = /entities:\s*\[([^\]]*)\]/;

        const match = fileContent.match(entityRegex);

        if (match) {
            const entitiesList = match[0].trim();

            fileContent = fileContent.replace(entitiesList, `entities: ${JSON.stringify(uniqueClassnames.map((item) => item.classname)).replaceAll('"', '')}`);
        }

        fs.writeFileSync(filePath, fileContent, 'utf8');
    }

    getAllModelClassnames() {
        const filenames = this.getAllFileNames(this.outputDir);

        return filenames.map((item) => ({ original: item, classname: this.convertFilenameToClassName(item) }));
    }

    isTimestamp(fields: Field[]) {
        const createdAt = fields.find((field) => field.name === 'created_at');
        const updatedAt = fields.find((field) => field.name === 'updated_at');

        return createdAt && updatedAt;
    }

    createPrimaryKey(primaryField: Field) {
        return `
        @PrimaryGeneratedColumn('increment')
        ${primaryField.name}: ${this.mapSqlDataTypeToJs(primaryField.type.type_name)};
        `;
    }

    exitsRelation(tableName: string) {
        return this.dataDb.refs.find((item) => item.endpoints.find((i) => tableName === i.tableName));
    }

    createColumn(tableName: string, item: Field) {
        let jsonParamsData = ``;

        if (item.name.includes('_id') && this.exitsRelation(tableName)) return '';

        const params = {
            type: this.extractType(item.type.type_name.toLocaleLowerCase()),
        };

        if (item.type.args?.length > 0 && !['enum'].includes(item?.type?.type_name)) {
            params['length'] = Number(item.type.args);
        }

        if (item?.not_null) {
            params['nullable'] = true;
        }

        if (item?.unique) {
            params['unique'] = true;
        }

        if (item?.dbdefault) {
            params['default'] = item.dbdefault.value;
        }

        if (['enum'].includes(item?.type?.type_name)) {
            const enumName = this.createEnumName(item);
            jsonParamsData = `{"type":"enum","enum":${enumName} ${item?.dbdefault ? `, default: ${enumName}.${item.dbdefault.value.toUpperCase()}` : ''} }`;
        } else {
            jsonParamsData = JSON.stringify(params).replaceAll('"null"', null);
        }

        return `
            @Column(${jsonParamsData})
            ${this.isExclude(item) ? '@Exclude()' : ''}
            ${item.name}: ${this.mapSqlDataTypeToJs(item.type.type_name, () => {
                return this.createEnumName(item);
            })};
        `;
    }

    createColumns(tableName: string, fields: Field[]) {
        let result = '';

        const clearedTimestamp = fields.filter((item) => {
            return item.name !== 'created_at' && item.name !== 'updated_at';
        });

        clearedTimestamp.forEach((item) => {
            if (item.pk) {
                result += this.createPrimaryKey(item);
            } else {
                result += this.createColumn(tableName, item);
            }
        });

        return result;
    }

    createImportModel(data: TableDefinition, refs: Relation[]) {
        const relations = this.getRelation(refs, data);

        const tableNames = this.getTableNamesOnRelation(data.name, relations);

        return tableNames.reduce((prev, cur) => {
            const className = this.toSingular(this.convertTableNameToClassName(cur));
            return (prev += `import ${className} from "./${cur.replaceAll('_', '-')}.entity";`);
        }, ``);
    }

    createImportTypeOrm(data: TableDefinition, refs: Relation[]) {
        const initImport = ['Entity', 'Column', 'PrimaryGeneratedColumn'];
        const relations = this.getRelation(refs, data);

        const mappings = relations.map((item) => {
            return this.mappingRef(this.sortEnpointWithTableName(data.name, item.endpoints)).key;
        });

        const uniqueTableNames = [...new Set(mappings)];

        const relationImports = uniqueTableNames.map((item) => (this.refNames[item] as string).replace('@', ''));

        return `import { ${[...initImport, ...relationImports].join(', ')} } from 'typeorm';`;
    }

    isExcludeDeep(data: TableDefinition, refs: Relation[]) {
        return data.fields.some((item) => this.isExclude(item)) || refs.some((item) => item.endpoints.map((i) => i.tableName).includes(data.name));
    }

    isExclude(field: Field) {
        return this.excludeKeys.find((item) => {
            return field.name.includes(item);
        });
    }

    createImportExclude(data: TableDefinition, refs: Relation[]) {
        const result = this.isExcludeDeep(data, refs);

        return result ? `import { Exclude } from 'class-transformer';` : '';
    }

    createTemplate(data: TableDefinition, refs: Relation[]) {
        const isTimestamp = this.isTimestamp(data.fields);
        const isExitsEnum = this.existEnum(data.fields);
        // this.createImportTypeOrm(data, refs);

        if (isExitsEnum) {
            this.createEnums(data.fields);
        }

        return `
            ${this.createImportTypeOrm(data, refs)}
            ${this.createImportExclude(data, refs)}
            ${isExitsEnum ? this.createEnumImports(data.fields) : ''}
            ${isTimestamp ? this.importPath.timestamp : ''}

            ${this.createImportModel(data, refs)}


            @Entity('${data.name}')
            export default class ${this.toSingular(this.convertTableNameToClassName(data.name))} ${isTimestamp ? 'extends Timestamp' : ''} {
                ${this.createColumns(data.name, data.fields)}

                
        
                ${this.createRelation(refs, data)}
        }`;
    }
}
