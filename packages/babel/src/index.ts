import fs from 'fs-extra';
import path from 'node:path';
import { Log, __dirname } from '@tsbb/typescript';
import { TransformOptions } from '@babel/core';
import babelPluginJsx from '@vue/babel-plugin-jsx';
import { transform } from './transform.js';
import { getOutputPath } from './utils.js';
import { getCjsTransformOption, getESMTransformOption } from './config.js';

export * from './utils.js';

export interface BabelCompileOptions {
  /**
   * The specified entry file, for example:
   * @example
   * ```js
   * entry = [ 'src/index.jsx', 'src/sum.js' ]
   * ```
   *
   * Command example:
   *
   * ```bash
   * $ tsbb build src/*.{jsx,js} --useBabel
   * $ tsbb build src/index.jsx --useBabel
   * ```
   */
  entry?: string[];
  /**
   * Use this parameter to compile code with `Babel` in a `TypeScript` project,
   * where `TS` is only used for type output and not for code compilation without `TS`.
   */
  useBabel?: boolean;
  /**
   * Output "esm" directory.
   * @platform `babel`
   * @default `esm`
   */
  esm?: false | string;
  /**
   * Output "cjs" directory.
   * When outputting types in conjunction with TypeScript, use the outDir configuration in tsconfig.json as the priority.
   * If this configuration exists, the --cjs configuration will be invalid.
   * @platform `babel`
   * @default `lib`
   */
  cjs?: false | string;
  /**
   * The current active environment used during configuration loading.
   * This value is used as the key when resolving ["env"](https://babeljs.io/docs/en/options#env) configs,
   * and is also available inside configuration functions, plugins, and presets, via the [api.env()](https://babeljs.io/docs/en/config-files#apienv) function.
   * > __Only allowed in Babel's programmatic options__
   */
  envName?: string;
  /**
   * @platform `babel`
   * @default `false`
   */
  useVue?: boolean;
  /**
   * If truthy, adds a `map` property to returned output. If set to `"inline"`, a comment with a sourceMappingURL directive is added to the bottom of the returned code. If set to `"both"`
   * then a `map` property is returned as well as a source map comment appended. **This does not emit sourcemap files by itself!**
   *
   * @platform `babel`
   * @default `false`
   */
  sourceMaps?: TransformOptions['sourceMaps'];
}

export default async function compile(fileName: string, options: BabelCompileOptions = {}) {
  const { cjs = 'lib', esm = 'esm', envName, useVue = false } = options;
  const dt = getOutputPath(fileName, options);
  const log = new Log();
  log.name();
  if ((options.sourceMaps as string) === 'true') {
    options.sourceMaps = true;
  }

  let esmBabelOptions = getESMTransformOption();
  if (useVue) {
    // @ts-ignore
    esmBabelOptions.plugins?.push(babelPluginJsx.default);
  }
  if (envName) {
    esmBabelOptions = {};
    esmBabelOptions.envName = envName;
  }
  esmBabelOptions.sourceMaps = options.sourceMaps || esmBabelOptions.sourceMaps;
  esmBabelOptions.babelrc = true;
  esmBabelOptions.cwd = dt.projectDirectory;

  if (typeof esm === 'string') {
    esmBabelOptions.sourceFileName = path.relative(path.dirname(dt.esm.path), fileName);
    transform(fileName, { ...esmBabelOptions })
      .then((result) => {
        fs.ensureFileSync(dt.esm.path);
        fs.writeFile(dt.esm.path, result?.code || '');
        log.icon('🐶').success(`┈┈▶ \x1b[32;1m${dt.folderFilePath}\x1b[0m => \x1b[34;1m${dt.esm.fileName}\x1b[0m`);
        if (esmBabelOptions.sourceMaps === 'both' || esmBabelOptions.sourceMaps) {
          if (result?.map) {
            const sourceMapPath = path.join(dt.esm.path + '.map');
            fs.writeFileSync(sourceMapPath, JSON.stringify(result?.map, null, 2));
            log
              .icon('🐶')
              .success(
                `┈┈▶ \x1b[32;1m${dt.folderFilePath}\x1b[0m => \x1b[34;1m${path.relative(
                  dt.projectDirectory,
                  sourceMapPath,
                )}\x1b[0m`,
              );
          }
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          log.icon('\n🚨').error(`\x1b[33;1m ${error.message}\x1b[0m\n`);
        } else {
          log.icon('\n🚨').error(`\x1b[33;1m ${JSON.stringify(error)}\x1b[0m\n`);
        }
      });
  }

  let cjsBabelOptions = getCjsTransformOption();
  if (useVue) {
    // @ts-ignore
    cjsBabelOptions.plugins?.push(babelPluginJsx.default);
  }
  if (envName) {
    cjsBabelOptions = {};
    cjsBabelOptions.envName = envName;
  }
  cjsBabelOptions.sourceMaps = options.sourceMaps || cjsBabelOptions.sourceMaps;
  cjsBabelOptions.babelrc = true;
  cjsBabelOptions.cwd = dt.projectDirectory;

  if (typeof cjs === 'string') {
    cjsBabelOptions.sourceFileName = path.relative(path.dirname(dt.cjs.path), fileName);
    transform(fileName, { ...cjsBabelOptions })
      .then((result) => {
        fs.ensureFileSync(dt.cjs.path);
        fs.writeFile(dt.cjs.path, result?.code || '');
        log.icon('🐶').success(`┈┈▶ \x1b[33;1m${dt.folderFilePath}\x1b[0m => \x1b[33;1m${dt.cjs.fileName}\x1b[0m`);
        if (cjsBabelOptions.sourceMaps === 'both' || cjsBabelOptions.sourceMaps) {
          if (result?.map) {
            const sourceMapPath = path.join(dt.cjs.path + '.map');
            fs.writeFileSync(sourceMapPath, JSON.stringify(result?.map, null, 2));
            log
              .icon('🐶')
              .success(
                `┈┈▶ \x1b[33;1m${dt.folderFilePath}\x1b[0m => \x1b[33;1m${path.relative(
                  dt.projectDirectory,
                  sourceMapPath,
                )}\x1b[0m`,
              );
          }
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          log.icon('\n🚨').error(`\x1b[33;1m ${error.message}\x1b[0m\n`);
        } else {
          log.icon('\n🚨').error(`\x1b[33;1m ${JSON.stringify(error)}\x1b[0m\n`);
        }
      });
  }
}
