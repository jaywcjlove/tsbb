import { Arguments } from 'yargs-parser';
import ts from 'typescript';
import { compile } from './utils/compile';

export interface BuildOptions extends Arguments {
  /**
   * Entry ts/js file
   * @default `src/index.ts`
   */
  entry?: string;
  /** Use Bebel to convert JS/TS */
  useBabel?: boolean;
  /** Disable Babel Option */
  disableBabelOption?: boolean;
  /**
   * The current active environment used during configuration loading.
   * This value is used as the key when resolving ["env"](https://babeljs.io/docs/en/options#env) configs,
   * and is also available inside configuration functions, plugins, and presets, via the [api.env()](https://babeljs.io/docs/en/config-files#apienv) function.
   * > __Only allowed in Babel's programmatic options__
   */
  envName?: string;
  /**
   * Output CJS directory.
   * @example `--no-cjs`
   */
  cjs?: string;
  /**
   * Output ESM directory.
   * @example `--no-esm`
   */
  esm?: string;
}

export async function build(options: BuildOptions, compilerOptions?: ts.CompilerOptions) {
  try {
    await compile([options.entry], compilerOptions, options);
  } catch (error) {
    console.error('ERROR', error);
    process.exit(1);
  }
}
