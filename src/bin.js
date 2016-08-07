#!/usr/bin/env node

import 'babel-polyfill';

import chalk from 'chalk';
import program from 'commander';

import rename from './dater';
import { version } from '../package.json';

let directoryValue;

program
  .version(version)
  .description('Rename photos based on their date taken')
  .arguments('<directory>')
  .action((directory) => {
    directoryValue = directory;
  });

program.parse(process.argv);

rename(directoryValue)
  .then(() => console.log(chalk.yellow('Photos renamed')))
  .catch(() => console.log(chalk.red("Photos can't be renamed")));
