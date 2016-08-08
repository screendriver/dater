#!/usr/bin/env node

import 'babel-polyfill';

import chalk from 'chalk';
import ora from 'ora';
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

const spinner = ora('Renaming photos').start();
rename(directoryValue, spinner)
  .then(() => {
    spinner.text = 'Renamed';
    spinner.succeed();
  })
  .catch((err) => {
    spinner.text = "Photos can't be renamed";
    spinner.fail();
    console.log(chalk.red(err.stack));
  });
