#!/usr/bin/env node
import chalk from 'chalk';
import ora, { Ora } from 'ora';
import program from 'commander';
import { rename } from './redater';

let directoryValue!: string;

program
  .version('0.1.0')
  .description('Rename photos based on their date taken')
  .arguments('<directory>')
  .action(directory => {
    directoryValue = directory;
  });

program.parse(process.argv);

const spinner = ora('Renaming photos').start();

function setSpinnerText(spinnerInstance: Ora) {
  return (text: string) => {
    spinnerInstance.text = text;
    spinnerInstance.stopAndPersist();
  };
}

rename(directoryValue, setSpinnerText(spinner))
  .then(() => {
    spinner.text = 'Renamed';
    spinner.succeed();
  })
  .catch(err => {
    spinner.text = "Photos can't be renamed";
    spinner.fail();
    // tslint:disable-next-line
    console.log(chalk.red(err.stack));
  });
