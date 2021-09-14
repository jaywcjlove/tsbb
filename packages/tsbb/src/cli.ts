#!/usr/bin/env node
/// <reference types="node" />

import ts from 'typescript';
import path from 'path';
import parser, { Arguments } from 'yargs-parser';
import { build } from './build';
import { watch } from './watch';
import { help } from './help';
import { jest } from './jest';

interface ArgvArguments extends Arguments {
  disableBabel?: boolean;
  esm?: boolean | string;
  cjs?: string;
  entry?: string;
  fileNames?: string | string[];
}

const argv: ArgvArguments = parser(process.argv.slice(2), {
  alias: {
    entry: ['e'],
    output: ['o'],
    help: ['h'],
    version: ['v'],
  },
});

(() => {
  const version = require('../package.json').version;
  if (argv.v) {
    console.log();
    console.log(` Version \x1b[32;1m ${version}\x1b[0m`);
    console.log();
    return;
  }
  if (argv.h) {
    return help();
  }
  try {
    argv.entry = path.resolve(process.cwd(), argv.entry || 'src/index.tsx');
    if (ts.sys.fileExists(argv.entry.replace(/\.tsx$/, '.ts'))) {
      argv.entry = argv.entry.replace(/\.tsx$/, '.ts');
    }

    if (typeof argv.fileNames === 'string') {
      argv.fileNames = [argv.fileNames];
    }

    if (argv.fileNames && Array.isArray(argv.fileNames)) {
      argv.fileNames = argv.fileNames.map((filename: string) => path.resolve(process.cwd(), filename));
      argv.fileNames = [argv.entry, ...argv.fileNames];
      argv.fileNames = Array.from(new Set(argv.fileNames));
    }

    if (!argv.fileNames) {
      argv.fileNames = [argv.entry];
    }

    if (argv.disableBabel) {
      argv.esm = false;
    }

    const configPath = ts.findConfigFile(path.dirname(argv.entry), ts.sys.fileExists);
    let tsConf = { compilerOptions: {} as ts.CompilerOptions };

    if (!configPath) {
      tsConf.compilerOptions.noEmit = true;
    } else {
      const data = ts.readConfigFile(configPath, ts.sys.readFile);
      const configParseResult = ts.parseJsonConfigFileContent(data.config, ts.sys, path.dirname(configPath));
      tsConf.compilerOptions = configParseResult.options;
    }
    if (argv.disableBabel === undefined) {
      argv.disableBabel = false;
    }
    if (argv._[0] === 'build') {
      return build(argv, { ...tsConf.compilerOptions });
    }

    if (argv._[0] === 'watch') {
      return watch(argv, { ...tsConf.compilerOptions });
    }

    if (argv._[0] === 'test') {
      return jest(argv);
    }

    help();
  } catch (error) {
    console.log('ERROR:', error);
  }
})();
