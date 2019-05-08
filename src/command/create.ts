import path from 'path';
import color from 'colors-cli';
import fs from 'fs-extra';
import { Argv } from 'yargs';
import { IMyYargsArgs, completePath } from '../utils';
import { helpOption } from './options';

export const command = 'create <project-name> [options]';
export const describe = 'Create a new project with TSBB';

export function builder(yarg: Argv) {
  return yarg.option({
    ...helpOption,
    'force': {
      alias: 'f',
      describe: 'force create.',
      type: 'boolean',
      default: false,
    },
    'example': {
      describe: 'Example from https://github.com/jaywcjlove/tsbb/tree/master/example example-path.',
      type: 'string',
      default: 'basic',
    }
  })
  .example('$ tsbb create my-app ', 'Create my project.')
  .example('$ tsbb create my-app --example express', 'Create an Express example project.')
}

export async function handler(args: IMyYargsArgs) {
  args = completePath(args);
  const projectPath = path.join(process.cwd(), args.projectName);
  if (args.force) {
    await fs.remove(projectPath);
  }

  if (fs.existsSync(projectPath)) {
    console.log(
      `\n Uh oh! Looks like there's already a directory called ${color.red(args.projectName)}\n`,
      `${color.yellow('Please try a different name or delete that folder.')}\n`,
      `Path: ${color.yellow(projectPath)}`
    );
    process.exit(1);
  }

  console.log('create', projectPath);
  console.log('args', args);
}