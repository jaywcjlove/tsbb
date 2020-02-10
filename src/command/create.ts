import path from 'path';
import color from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import { Argv } from 'yargs';
import { IMyYargsArgs, completePath, run } from '../utils';
import { helpOption } from './options';
import { moverDir } from '../utils/moverDir';
import installDeps from '../utils/installDeps';

export const command = 'create <project-name> [options]';
export const describe = 'Create a new project with TSBB';

export function builder(yarg: Argv) {
  const pkgs = fs.readJSONSync(path.join(__dirname, '..', '..', 'package.json'));
  return yarg.config({ tsbbVersion: pkgs.version }).option({
    ...helpOption,
    'force': {
      alias: 'f',
      describe: 'force create.',
      type: 'boolean',
      default: false,
    },
    'example': {
      alias: 'e',
      describe: 'Example from https://github.com/jaywcjlove/tsbb/tree/master/example example-path.',
      type: 'string',
      default: 'basic',
    },
  })
  .example('$ tsbb create my-app ', 'Create my project.')
  .example('$ tsbb create my-app --example express', 'Create an Express example project.');
}


export interface ICreateArgs extends IMyYargsArgs {
  force?: boolean;
  example?: string;
}

export async function handler(args: ICreateArgs) {
  args = completePath(args) as ICreateArgs;
  const projectPath = path.join(process.cwd(), args.projectName);
  const cacheDir = path.join(projectPath, '.cache-tsbb');
  const exampleDir: string = path.join(cacheDir, 'example', (args.example || '').toLowerCase());
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
    console.log();
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
    spinner.succeed(` Creating a new ${color.green(args.example)} app in ${color.green(projectPath)}`);
    const files = await moverDir(exampleDir, projectPath);
    const pkgPath = files.find((filePath) => /package\.json$/.test(filePath));
    if (pkgPath) {
      const pkg = await fs.readJSON(pkgPath);
      if (pkg.devDependencies && pkg.devDependencies['tsbb']) {
        pkg.devDependencies['tsbb'] = args.tsbbVersion;
      }
      if (pkg.dependencies && pkg.dependencies['tsbb']) {
        pkg.dependencies['tsbb'] = args.tsbbVersion;
      }
      await fs.outputJSON(pkgPath, pkg, { spaces: '  ', EOL: '\n' });
    }
    await fs.remove(cacheDir);
    await installDeps(projectPath, 'npm');
    spinner.stopAndPersist({
      symbol: '🎉',
      text: `Successfully created project ${color.yellow(args.projectName)}`
    });
    console.log(
      '\n Inside that directory, you can run several commands:\n\n',
      `  \x1b[33;1m$\x1b[0m ${color.green('npm watch')}\n`,
      `     Starts the development\n\n`,
      `  \x1b[33;1m$\x1b[0m ${color.green('npm build')}\n`,
      `     Bundles the app files for production.\n\n`,
      ` We suggest that you begin by typing:\n\n`,
      `   ${color.green('cd')} ${args.projectName}\n`,
      `   ${color.green('npm install')}\n`,
    );
  } catch (error) {
    console.log(error);
  }
}