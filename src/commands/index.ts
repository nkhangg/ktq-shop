#!/usr/bin/env ts-node

import { Command } from 'commander';
import { ModelGenerateConmand } from './generate-model';
import { ServiceGenerateConmand } from './generate-service';
const program = new Command();

program
    .command('generate <subcommand>')
    .description('Generate something')
    .option('-f, --file <path>', 'Specify a file path')
    .option('-m, --module <name>')
    .option('-md, --model <name>')
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

                modelCommand.generateModels();
                break;
            case 's-g':
            case 'service-generate':
                const serviceCommand = new ServiceGenerateConmand();

                serviceCommand.generateService();
                break;
        }
    });

// Phân tích các tham số dòng lệnh
program.parse(process.argv);
