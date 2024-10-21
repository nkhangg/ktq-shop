#!/usr/bin/env ts-node

import { Command } from 'commander';
import { GenerateCommand } from './generate.command';

const program = new Command();
const generator = new GenerateCommand();

program
    .command('s-g')
    .description('Generate models from db_schemas.dbml')
    .action(() => {
        // generator.generateModels();
        console.log('ac');
        console.log(`Models generated from ect/db_schemas.dbml`);
    });

program.parse(process.argv);
