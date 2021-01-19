#!/usr/bin/env node

import minimist from 'minimist';
import { create } from 'create-kkt';

async function run(): Promise<void> {
  try {
    const argvs = minimist(process.argv.slice(2));
    if (argvs.h || argvs.help) {
      console.log('\n  Usage: create-tsbb <app-name> [options] [--help|h]');
      console.log('\n  Options:');
      console.log('    --version, -v', 'Show version number');
      console.log('    --help, -h', 'Displays help information.');
      console.log(
        '    --example, -e',
        'Example from: \x1b[34mhttp://jaywcjlove.github.io/tsbb/ \x1b[0m , default: "basic"',
      );
      console.log('    --force, -f', 'Overwrite target directory if it exists. default: false');
      console.log(
        '    --path, -p',
        'Specify the download target git address. default: "\x1b[34mhttp://jaywcjlove.github.io/tsbb/ \x1b[0m"',
      );
      exampleHelp();
      console.log('\n  Copyright 2021');
      console.log('\n');
      return;
    }
    const { version } = require('../package.json');
    if (argvs.v || argvs.version) {
      console.log(`\n create-tsbb v${version}\n`);
      return;
    }
    argvs.appName = argvs._[0];
    argvs.path = argvs.p = argvs.path || argvs.p || 'http://jaywcjlove.github.io/tsbb/';
    argvs.force = argvs.f = argvs.force || argvs.f || false;
    argvs.example = argvs.e = (argvs.example || argvs.e || 'basic').toLocaleLowerCase();
    create(argvs, exampleHelp);
  } catch (error) {
    console.log(`\x1b[31m${error.message}\x1b[0m`);
    console.log(error);
    process.exit(1);
  }
}

export function exampleHelp() {
  console.log('\n  Example:');
  console.log('    \x1b[35myarn\x1b[0m create tsbb \x1b[33mappName\x1b[0m');
  console.log('    \x1b[35mnpx\x1b[0m create-tsbb \x1b[33mmy-app\x1b[0m');
  console.log('    \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m');
  console.log('    \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m -f');
  console.log(
    '    \x1b[35mnpm\x1b[0m create tsbb \x1b[33mmy-app\x1b[0m -p \x1b[34mhttp://jaywcjlove.github.io/tsbb/\x1b[0m',
  );
}

try {
  run();
} catch (error) {
  console.log(`\x1b[31m${error.message}\x1b[0m`);
  console.log(error);
  process.exit(1);
}
