import path, { dirname } from 'path';
import { runCLI } from '@jest/core';
import { type Config } from '@jest/types';
import { fileURLToPath } from 'url';
import createJestConfig from './jest.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type JestOptions = Partial<Config.Argv>;
export default async function jest(options: JestOptions = {}) {
  const { env, coverage = false, rootDir = process.cwd() } = options;
  const config = await createJestConfig(
    (relativePath: string) => path.resolve(__dirname, '..', relativePath),
    path.resolve(rootDir),
  );

  options.config = JSON.stringify(config);
  if (coverage) {
    options.watchAll = false;
    process.env.BABEL_ENV = 'development';
  } else if (!process.env.CI) {
    process.env.BABEL_ENV = 'production';
    options.watchAll = true;
  }
  runCLI({ ...options, env, coverage, rootDir } as Config.Argv, [process.cwd()]);
}
