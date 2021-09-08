import path from 'path';
import semver from 'semver';
import { transformFile, BabelFileResult, TransformOptions, loadOptions } from '@babel/core';
import { outputFiles } from '../utils/output';
import { BuildOptions } from '../build';

interface TransformHandleOptions extends Omit<BuildOptions, '_'>, BabelFileResult {}
interface TransformBabelFileResult extends BabelFileResult {
  options: TransformOptions;
}

/**
 * @param filename `/basic/src/utils/a/a.ts`
 */
export function transform(filename: string, options?: TransformHandleOptions): Promise<TransformBabelFileResult> {
  const { cjs, esm, entryDir, disableBabelOption, envName } = options;
  const outputDir = filename.replace(entryDir, cjs || esm);
  const sourceFileName = path.join(
    path.relative(path.dirname(outputDir), path.dirname(filename)),
    path.basename(filename),
  );
  let babelOptions: TransformOptions = {
    presets: [
      [
        require('@babel/preset-react').default,
        {
          /**
           * Fix: ReferenceError: React is not defined
           * https://github.com/facebook/create-react-app/issues/9882
           */
          runtime: 'automatic',
        },
      ],
      require('@babel/preset-typescript').default,
    ],
    sourceMaps: true,
    sourceFileName,
    plugins: [
      require('@babel/plugin-syntax-dynamic-import').default,
      // require('babel-plugin-add-module-exports'),
      require('babel-plugin-transform-typescript-metadata').default,
      /**
       * Use the legacy (stage 1) decorators syntax and behavior.
       * https://babeljs.io/docs/en/babel-plugin-proposal-decorators#legacy
       * If you are including your plugins manually and using `@babel/plugin-proposal-class-properties`,
       * make sure that `@babel/plugin-proposal-decorators` comes before `@babel/plugin-proposal-class-properties`.
       */
      [require('@babel/plugin-proposal-decorators').default, { legacy: true }],
    ],
  };

  if (!babelOptions.envName) {
    babelOptions.envName = process.env.BABEL_ENV;
  }
  const runtimeVersion = semver.clean(require('@babel/runtime/package.json').version);
  if (cjs) {
    babelOptions.presets.push([
      require('@babel/preset-env').default,
      {
        modules: 'cjs',
        loose: false,
      },
    ]);
    babelOptions.envName = 'cjs';
    const transformRuntime = {
      modules: 'cjs',
      loose: false,
      /**
       * transform-runtime regression, not requiring _objectSpread helper
       * https://github.com/babel/babel/issues/10261#issuecomment-549940457
       */
      version: require('@babel/helpers/package.json').version,
    };
    if (!semver.gte(runtimeVersion, '7.13.0')) {
      /**
       * ⚠️ This option has been deprecated: starting from version 7.13.0,
       * @babel/runtime's package.json uses "exports" option to automatically choose between CJS and ESM helpers.
       * https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
       */
      (transformRuntime as any).useESModules = !semver.gte(runtimeVersion, '7.13.0');
    }
    babelOptions.plugins.push(require('@babel/plugin-transform-modules-commonjs').default);
    babelOptions.plugins.push([require('@babel/plugin-transform-runtime').default, transformRuntime]);
    babelOptions.plugins.push([
      require('babel-plugin-transform-remove-imports').default,
      {
        test: '\\.(less|css)$',
      },
    ]);
    babelOptions.plugins.push([require('@babel/plugin-proposal-class-properties').default, { loose: false }]);
    babelOptions.plugins.push([require('@babel/plugin-transform-classes').default, { loose: false }]);
  }

  if (esm) {
    babelOptions.presets.push([
      require('@babel/preset-env').default,
      {
        modules: false,
        loose: true,
        targets: {
          esmodules: true,
        },
      },
    ]);
    babelOptions.envName = 'esm';
    const transformRuntime = {
      loose: false,
      modules: 'auto',
      /**
       * transform-runtime regression, not requiring _objectSpread helper
       * https://github.com/babel/babel/issues/10261#issuecomment-549940457
       */
      version: require('@babel/helpers/package.json').version,
    };
    if (!semver.gte(runtimeVersion, '7.13.0')) {
      /**
       * ⚠️ This option has been deprecated: starting from version 7.13.0,
       * @babel/runtime's package.json uses "exports" option to automatically choose between CJS and ESM helpers.
       * https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
       */
      (transformRuntime as any).useESModules = !semver.gte(runtimeVersion, '7.13.0');
    }
    babelOptions.plugins.push([require('@babel/plugin-transform-runtime').default, transformRuntime]);
    babelOptions.plugins.push([require('@babel/plugin-proposal-class-properties').default, { loose: true }]);
    babelOptions.plugins.push([
      require('babel-plugin-transform-rename-import').default,
      {
        original: '^(.+?)\\.(less|scss|sass|styl)$',
        replacement: '$1.css',
      },
    ]);
  }
  if (envName) {
    babelOptions = {};
    loadOptions({ envName: envName });
  }
  if (disableBabelOption) {
    babelOptions = {};
  }
  return new Promise((resolve, reject) => {
    transformFile(filename, babelOptions, (err: Error, result: TransformBabelFileResult) => {
      if (err) {
        return reject(err);
      }
      try {
        const output = result.options.filename
          .replace(entryDir, cjs || esm)
          .replace(/\.(ts|tsx)$/, '.js')
          .replace(/\.jsx$/, '.js');
        if (!babelOptions.sourceMaps) {
          outputFiles(output, result.code, result.map);
        } else {
          outputFiles(output, `${result.code}\n//# sourceMappingURL=${path.parse(output).base}.map`, result.map);
        }
      } catch (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}
