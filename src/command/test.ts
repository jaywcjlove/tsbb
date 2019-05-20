import { Argv } from 'yargs';
import path from 'path';
import color from 'colors-cli';
import fs from 'fs-extra';
import jest from 'jest';
import { IMyYargsArgs, completePath } from '../utils';
import { helpOption } from './options';
import createJestConfig from '../jest/jest.config';

export const command = 'test [options]';
export const describe = 'Run jest test runner in watch mode.';

export function builder(yarg: Argv) {
  return yarg.option({
    ...helpOption,
    'coverage': {
      describe: 'Indicates that test coverage information should be collected and reported in the output.',
      type: 'boolean',
      default: false,
    },
    'env': {
      describe: 'The test environment used for all tests.',
      type: 'string',
      default: 'node',
    },
    'config': {
      describe: 'The path to a Jest config file specifying how to find and execute tests.',
      type: 'string',
    },
  })
  .example('$ tsbb test', 'Run test suites related')
  .example('$ tsbb test --coverage', 'Test coverage information should be collected');
}

export interface ITestArgs extends IMyYargsArgs {
  env?: string;
  config?: string;
  coverage?: boolean;
}

export async function handler(args: ITestArgs) {
  args = completePath(args);
  const jestArgs: string[] = [];
  jestArgs.push(`--env=${args.env}`);

  if (args.config) {
    const jestConfPath: string = path.join(args.sourceRoot, args.config);
    if (!fs.existsSync(jestConfPath)) {
      console.log(
        `\n Uh oh! Looks like there's your configuration does not exist.\n`,
        `Path: ${color.yellow(jestConfPath)}\n`
      );
      return;
    }
    if (fs.existsSync(jestConfPath)) {
      jestArgs.push(`--config=${jestConfPath}`);
    }
  }

  if (args.coverage) {
    jestArgs.push('--coverage');
  } else if (!process.env.CI) {
    jestArgs.push('--watchAll');
  }
  jestArgs.push(
    '--config',
    JSON.stringify(
      createJestConfig(
        (relativePath: string) => path.resolve(__dirname, '..', '..', relativePath),
        path.resolve(args.sourceRoot)
      )
    )
  );
  jest.run(jestArgs);
}