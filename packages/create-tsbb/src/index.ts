import path from 'node:path';
import meow from 'meow';
import fs from 'fs-extra';
import * as url from 'url';
import which from 'which';
import { $ } from 'execa';
import { helpStr, exampleStr } from './helpStr.js';

export const TEMPLATE = [
  'babel-transform-ts',
  'basic',
  'express',
  'hapi',
  'koa',
  'react-component',
  'react-component-tsx',
  'typenexus',
  'umd',
  'vue',
];
export const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
export type CreateOptions = {
  example: string;
  force: boolean;
};

const ErrorExistsDir = (appName: string, projectPath: string) => `
🚨 Uh oh! It looks like there is already a directory called\x1b[31m ${appName}\x1b[0m
   \x1b[33mPlease try another name or delete the folder\x1b[0m
    └── Path: \x1b[33m${projectPath}\x1b[0m\n
    You can also use the \x1b[33;1m-f\x1b[0m parameter to force generation
    WARNING ⚠️  This is very dangerous, existing folders will be emptied.
`;

export async function create() {
  const cli = meow(helpStr(), {
    importMeta: import.meta,
    flags: {
      example: {
        default: 'basic',
        type: 'string',
        alias: 'e',
      },
      force: {
        default: false,
        type: 'boolean',
        alias: 'f',
      },
    },
  });
  const flags: CreateOptions & Record<string, unknown> = cli.flags;
  if (flags.h || flags.help) {
    cli.showHelp();
    process.exitCode = 0;
  }
  if (flags.v || flags.version) {
    cli.showVersion();
    process.exitCode = 0;
  }
  try {
    const REG = /^[A-Za-z0-9_\-\.]{1,}$/;
    const appName = cli.input[0] || 'my-app';
    if (!REG.test(appName) || !appName) {
      throw new Error(
        `\x1b[31mThe name directory name\x1b[0m \x1b[33m${appName}\x1b[0m \x1b[31mcontains special characters.\x1b[0m\n${exampleStr}`,
      );
    }
    if (TEMPLATE.indexOf(flags.example) === -1) {
      throw new Error(
        `You can choose the following templates: \n${TEMPLATE.map(
          (name) => ` \x1b[37;1m-\x1b[0m \x1b[33;1m${name}\x1b[0m`,
        ).join('  \n')}`,
      );
    }
    const projectPath = path.resolve(process.cwd(), appName);
    if (flags.force) {
      await fs.ensureDir(projectPath);
      await fs.ensureDir(projectPath);
    } else if (fs.existsSync(projectPath)) {
      throw new Error(ErrorExistsDir(appName, projectPath));
    }
    await fs.ensureDir(projectPath);
    await fs.emptyDir(projectPath);
    const template = path.resolve(__dirname, `../dist/${flags.example}`);
    await fs.copy(template, projectPath);

    const RENAME = [
      '_.npmrc',
      '_.gitignore',
      '_.babelrc',
      '_.prettierignore',
      '_.prettierrc',
      '_.parcelrc',
      '_tsconfig.json',
      '_package.json',
    ];
    await Promise.all(
      RENAME.map(async (fileName) => {
        const tempIgnorePath = path.resolve(projectPath, fileName);
        if (fs.existsSync(tempIgnorePath)) {
          await fs.rename(tempIgnorePath, path.resolve(projectPath, fileName.replace(/^_/, '')));
        }
      }),
    );
    const git = await which('git', { nothrow: true });
    const gitDir = path.join(projectPath, '.git');
    if (git && !fs.existsSync(gitDir)) {
      const $$ = $({ cwd: projectPath });
      const gitInit = await $$`${git} init`;
      console.log(`   \x1b[37;1m${gitInit.stdout}\x1b[0m\n`);
    }
    console.log(`   Happy hacking!\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.log(`\x1b[31;1m${error.message}\x1b[0m\n`);
    } else {
      console.log(`\x1b[31;1m${JSON.stringify(error)}\x1b[0m\n`);
    }
    process.exit(1);
  }
}
