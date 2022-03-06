import { Arguments } from 'yargs-parser';
import ts from 'typescript';
import { compile } from './utils/compile';

export interface BuildOptions extends Partial<Arguments> {
  /**
   * Entry ts/js file
   * @default `src/index.ts`
   */
  entry?: string;
  /** Disable Babel Option */
  disableBabelOption?: boolean;
  /** Disable Babel */
  disableBabel?: boolean;
  /**
   * The current active environment used during configuration loading.
   * This value is used as the key when resolving ["env"](https://babeljs.io/docs/en/options#env) configs,
   * and is also available inside configuration functions, plugins, and presets, via the [api.env()](https://babeljs.io/docs/en/config-files#apienv) function.
   * > __Only allowed in Babel's programmatic options__
   */
  envName?: string;
  /**
   * To add Vue JSX support.
   * @default false
   */
  useVue?: boolean;
  /**
   * Output CJS directory.
   * @example `--no-cjs`
   */
  cjs?: string;
  /**
   * Output ESM directory.
   * @example `--no-esm`
   */
  esm?: boolean | string;
}

export async function build(options: BuildOptions, compilerOptions?: ts.CompilerOptions) {
  try {
    await compile(options.fileNames, compilerOptions, options);
  } catch (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
}
