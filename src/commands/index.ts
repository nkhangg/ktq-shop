#!/usr/bin/env ts-node

import { Command } from 'commander';
import { ModelGenerateConmand } from './generate-model';
const program = new Command();

const modelCommand = new ModelGenerateConmand();

program
    .command('generate <subcommand>')
    .description('Generate something')
    .action((subcommand) => {
        switch (subcommand) {
            case 'm-g':
            case 'model-generate':
                modelCommand.generateModels();
                break;
            case 's-g':
            case 'service-generate':
                modelCommand.generateModels();
                break;
        }
    });

// Phân tích các tham số dòng lệnh
program.parse(process.argv);
