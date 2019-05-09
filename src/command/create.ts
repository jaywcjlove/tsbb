import path from 'path';
import color from 'colors-cli';
import fs from 'fs-extra';
import ora from 'ora';
import yargs, { Argv } from 'yargs';
import { IMyYargsArgs, completePath, run } from '../utils';
import { helpOption } from './options';
import { moverDir } from '../utils/moverDir';

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
  console.log('args:', args.__proto__);
  console.log('this:', yargs);
  args = completePath(args);
  const projectPath = path.join(process.cwd(), args.projectName);
  const cacheDir = path.join(projectPath, '.cache-tsbb');
  const exampleDir: string = path.join(cacheDir, 'example', args.example || '');
  try {
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
    const spinner = ora(`Downloading files for ${color.green(args.example)} example`).start();
    await fs.ensureDir(projectPath);
    await fs.ensureDir(cacheDir);
    await run('git', ['clone', 'https://github.com/jaywcjlove/tsbb.git', '--depth', '1', cacheDir]);
    spinner.stop();
    const exist = await fs.pathExists(exampleDir);
    if (!exist) {
      spinner.fail(`Error: The example ${color.red(args.example)} does not exist!`);
      return;
    }
    spinner.succeed(`Creating a new ${args.example} app in ${color.green(projectPath)}`);
    const files = await moverDir(exampleDir, projectPath);
    const pkgPath = files.find((filePath) => /package\.json$/.test(filePath));
    if (pkgPath) {
      const pkg = await fs.readJSON(pkgPath);
      console.log('pkg:', pkg);
    }
    await fs.remove(cacheDir);

  } catch (error) {
    console.log(error);
  }
}