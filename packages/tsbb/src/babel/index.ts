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
    presets: [require.resolve('@babel/preset-react'), require.resolve('@babel/preset-typescript')],
    sourceMaps: true,
    sourceFileName,
    plugins: [
      require.resolve('@babel/plugin-syntax-dynamic-import'),
      require.resolve('babel-plugin-add-module-exports'),
      require.resolve('babel-plugin-transform-typescript-metadata'),
      [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
      [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
    ],
  };

  if (!babelOptions.envName) {
    babelOptions.envName = process.env.BABEL_ENV;
  }

  if (cjs) {
    babelOptions.presets.push([
      require.resolve('@babel/preset-env'),
      {
        loose: true,
      },
    ]);
    babelOptions.envName = 'cjs';
    babelOptions.plugins.push([
      require.resolve('@babel/plugin-transform-runtime'),
      {
        useESModules: false,
        loose: false,
        modules: 'cjs',
        // https://github.com/babel/babel/issues/10261#issuecomment-549940457
        version: require('@babel/helpers/package.json').version,
      },
    ]);
    babelOptions.plugins.push([require.resolve('babel-plugin-transform-remove-imports'), {
      test: "\\.(less|css)$"
    }]);
  }

  if (esm) {
    const runtimeVersion = semver.clean(require('@babel/runtime/package.json').version);
    babelOptions.presets.push([
      require.resolve('@babel/preset-env'),
      {
        modules: false,
        loose: true,
      },
    ]);
    babelOptions.envName = 'esm';
    const transformRuntime = {
      useESModules: true,
      loose: false,
      modules: 'auto',
      // https://github.com/babel/babel/issues/10261#issuecomment-549940457
      version: require('@babel/helpers/package.json').version,
    };
    if (!semver.gte(runtimeVersion, '7.13.0')) {
      transformRuntime.useESModules = !semver.gte(runtimeVersion, '7.13.0');
    }
    babelOptions.plugins.push([require.resolve('@babel/plugin-transform-runtime'), transformRuntime]);
    babelOptions.plugins.push([require.resolve('babel-plugin-transform-rename-import'), {
      original: '^(.+?)\\.less$', replacement: '$1.css'
    }]);
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
