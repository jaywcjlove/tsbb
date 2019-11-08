import path from 'path';
import { Argv } from 'yargs';
// import * as ts from 'typescript';
import { helpOption } from '../command/options';
import { IMyYargsArgs } from '../utils';
import { executeCommand } from '../utils/executeCommand';

export const command = 'types [options]';
export const describe = 'Create type files for the project.';

// https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API

export interface ITypesArgs extends IMyYargsArgs {
  project?: string;
  'out-dir'?: string;
  outDir?: string;
  emitDeclarationOnly?: boolean;
  target?: string;
  tsconf?: string;
}

export function builder(yarg: Argv) {
  return yarg.option({
    ...helpOption,
    'project': {
      describe: "Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.",
      type: 'string',
      default: './',
    },
    'out-dir': {
      describe: 'Redirect output structure to the directory.',
      type: 'string',
      default: 'lib',
    },
    'target': {
      describe: 'Specify ECMAScript target version.',
      type: 'string',
      default: 'ES2015',
      choices: ['ES3', 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ESNEXT'],
    },
    'watch': {
      describe: 'Watch input files.',
      type: 'boolean',
      default: false,
    },
    'emit-declaration-only': {
      describe: 'to enable declarations only output',
      type: 'boolean',
      default: true,
    },
    'tsconf': {
      describe: 'TypeScript other options.',
      type: 'string',
    },
  })
    .example('$ tsbb types ', 'Create types your project.')
    .example('$ tsbb types --watch', 'Create type files for the project And to run in --watch mode.')
}

export async function handler(args: ITypesArgs) {
  let tscArgs: string[] = [];

  if (args.target) {
    tscArgs.push('--target');
    tscArgs.push(args.target);
  }

  // tscArgs.push('--types');

  if (args.emitDeclarationOnly) {
    tscArgs.push('--emitDeclarationOnly');
  }

  if (args.project) {
    tscArgs.push('--project');
    tscArgs.push(args.project);
  }

  if (args.outDir) {
    if (Array.isArray(args.outDir)) {
      args.outDir.forEach(item => {
        tscArgs.push('--outDir');
        tscArgs.push(item);
      });
    } else {
      tscArgs.push('--outDir');
      tscArgs.push(args.outDir);
    }
  }
  if (args.watch) {
    tscArgs.push('--watch');
  }
  if (args.tsconf) {
    tscArgs = tscArgs.concat(args.tsconf.split(' '))
  }
  const projectPath = path.resolve(process.cwd(), args.sourceRoot || '');
  try {
    await executeCommand('tsc', tscArgs, projectPath);
    if (!args.watch) {
      console.log('🎉', 'Successfully created a project type files!');
    }
  } catch (error) {
    console.log(error);
  }
}