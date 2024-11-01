#!/usr/bin/env ts-node

import { Command } from 'commander';
import { ModelGenerateConmand } from './generate-model';
import { ServiceGenerateConmand } from './generate-service';
import { InitGenerateCommand } from './generate-init';
import { ControllerGenerateCommand } from './generate-controllers';
const program = new Command();

program
    .command('generate <subcommand>')
    .description('Generate something')
    .option('-f, --file <path>', 'Specify a file path')
    .option('-m, --module <name>', '')
    .option('-e, --entity <values>', 'Entity name')
    .option('-t, --table <name>', 'Table name')
    .option('-i, --controllerFolder <name>', 'Include controller folder ?')
    .action((subcommand, options) => {
        switch (subcommand) {
            case 'm-g':
            case 'model-generate':
                const modelCommand = new ModelGenerateConmand();

                if (options && options?.file) {
                    const file = options.file as string;

                    if (file.split('.').at(-1) !== 'dbml') {
                        console.error('The extensions must .dbml');
                        return;
                    }

                    modelCommand.setSchemaFilePath(file);
                }

                if (options && options?.table) {
                    const tableName = options.table;

                    modelCommand.generateModel(tableName);
                    return;
                }

                modelCommand.generateModels();
                break;
            case 's-g':
            case 'service-generate':
                if (!options) {
                    console.log('Please add option to generate');
                    return;
                }

                const serviceCommand = new ServiceGenerateConmand();

                if (options?.file) {
                    serviceCommand.setSchemaFilePath(options.file);
                }

                if (options?.table) {
                    serviceCommand.generateServiceWithTableName(options.table);
                    return;
                }

                if (!options?.entity) {
                    console.log('The entity is required');
                    return;
                }

                if (!options?.module) {
                    serviceCommand.generateServiceWithModelName(options.module);
                    return;
                }

                break;

            case 'controller-generate':
            case 'c-g':
                if (!options) {
                    console.log('Please add option to generate');
                    return;
                }

                const controllerGenerateCommand = new ControllerGenerateCommand();
                if (options?.module) {
                    controllerGenerateCommand.generateWithModuleName(options.module, options?.controllerFolder);
                    return;
                }

                break;
            case 'init-app':
                const initAppCommand = new InitGenerateCommand();

                initAppCommand.generateInit();
                break;
        }
    });

// Phân tích các tham số dòng lệnh
program.parse(process.argv);
