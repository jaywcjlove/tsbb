import path from 'path';
import fs from 'fs-extra';
import ora from 'ora';
import { Argv } from 'yargs';
import { IMyYargsArgs, completePath, run } from '../utils';
import { helpOption } from './options';
import { moverDir } from '../utils/moverDir';
import { installDeps } from '../utils/installDeps';

export const command = 'create <project-name> [options]';
export const describe = 'Create a new project with TSBB';

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
        `\n Uh oh! Looks like there's already a directory called \x1b[1;31m${args.projectName}\x1b[0m\n`,
        `\x1b[1;33m Please try a different name or delete that folder.\x1b[0m\n`,
        `Path: \x1b[1;33m${projectPath}\x1b[0m`,
      );
      process.exit(1);
    }
    console.log();
    const spinner = ora(`Downloading files for \x1b[1;32m${args.example}\x1b[0m example`).start();
    await fs.ensureDir(projectPath);
    await fs.ensureDir(cacheDir);
    await run('git', ['clone', 'https://github.com/jaywcjlove/tsbb.git', '--depth', '1', cacheDir]);
    spinner.stop();
    const exist = await fs.pathExists(exampleDir);
    if (!exist) {
      spinner.fail(`Error: The example \x1b[1;31m${args.example}\x1b[0m does not exist!`);
      return;
    }
    spinner.succeed(` Creating a new \x1b[1;32m${args.example}\x1b[0m app in \x1b[1;32m${projectPath}\x1b[0m`);
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
      text: `Successfully created project \x1b[1;33m${args.projectName}\x1b[0m`,
    });
    console.log(
      '\n Inside that directory, you can run several commands:\n\n',
      `  \x1b[33;1m$\x1b[0m \x1b[1;32m${'npm watch'}\x1b[0m\n`,
      `     Starts the development\n\n`,
      `  \x1b[33;1m$\x1b[0m \x1b[1;32m${'npm build'}\x1b[0m\n`,
      `     Bundles the app files for production.\n\n`,
      ` We suggest that you begin by typing:\n\n`,
      `   \x1b[1;32m${'cd'}\x1b[0m ${args.projectName}\n`,
      `   \x1b[1;32m${'npm install'}\x1b[0m\n`,
    );
  } catch (error) {
    console.log(error);
  }
}
