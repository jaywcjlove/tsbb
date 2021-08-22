import path from 'path';
import { runCLI } from '@jest/core';
import { Config } from '@jest/types';
import createJestConfig from './jest.config';

export interface JestOptions extends Config.Argv {}
export function jest(options: JestOptions) {
  const { env, coverage = false, rootDir = process.cwd() } = options;
  const config = createJestConfig(
    (relativePath: string) => path.resolve(__dirname, '..', '..', relativePath),
    path.resolve(rootDir),
  );

  options.config = JSON.stringify(config);
  if (coverage) {
    options.watchAll = false;
  } else if (!process.env.CI) {
    options.watchAll = true;
  }
  runCLI({ ...options, env, coverage, rootDir }, [process.cwd()]);
}
