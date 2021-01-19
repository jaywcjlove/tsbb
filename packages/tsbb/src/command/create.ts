import path from 'path';
import fs from 'fs-extra';
import { Argv } from 'yargs';
import { IMyYargsArgs } from '../utils';
import { helpOption } from './options';

export const command = 'create <project-name> [options]';
export const describe = 'Please use \x1b[1;32mcreate-tsbb\x1b[0m to create an example.';

export function builder(yarg: Argv) {
  const pkgs = fs.readJSONSync(path.join(__dirname, '..', '..', 'package.json'));
  return yarg
    .config({ tsbbVersion: pkgs.version })
    .option({
      ...helpOption,
      force: {
        alias: 'f',
        describe: 'force create.',
        type: 'boolean',
        default: false,
      },
      example: {
        alias: 'e',
        describe: 'Example from https://github.com/jaywcjlove/tsbb/tree/master/example example-path.',
        type: 'string',
        default: 'basic',
      },
    })
    .example('$ npm create tsbb my-app -e express ', 'Please use create-tsbb to create an example.')
}

export interface ICreateArgs extends IMyYargsArgs {
  force?: boolean;
  example?: string;
}

export async function handler() {
  console.log(
    'Uh oh! Please use \x1b[1;32mcreate-tsbb\x1b[0m to create an example.\n',
    '  └─> \x1b[1;34mhttps://www.npmjs.com/package/create-tsbb\x1b[0m\n',
    ' $\x1b[1;35m yarn\x1b[0m create tsbb [appName]',
    ' $\x1b[1;35m npm\x1b[0m create tsbb my-app',
    ' $\x1b[1;35m npx\x1b[0m create-tsbb my-app',
  );
}
