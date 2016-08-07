#!/usr/bin/env node

import 'babel-polyfill';
import program from 'commander';

// import rename from './dater';
import { version } from '../package.json';

program
  .version(version)
  .parse(process.argv);

console.log(version);
