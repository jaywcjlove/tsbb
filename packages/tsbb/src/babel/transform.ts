import path from 'path';
import semver from 'semver';
import { transformFile, BabelFileResult, TransformOptions, loadOptions } from '@babel/core';
import { IOptions } from '@tsbb/babel-preset-tsbb';

export interface ITransformResult extends BabelFileResult {
  options: TransformOptions;
}

export interface ITransformOptions {
  envName: string;
  outputPath: string;
  comments: boolean;
  sourceMaps: boolean | 'inline' | 'both' | 'none';
}

export type ITargets = 'node' | 'react';

export default (filePath: string, options: ITransformOptions, targets: ITargets) => {
  let babelOptions: TransformOptions = {};
  if (targets === 'react') {
    let presetOptions: IOptions = {
      targets: { browsers: ['last 2 versions'] },
    };
    if (options.envName === 'cjs') {
      presetOptions.modules = 'cjs';
      presetOptions.transformRuntime = {
        // https://github.com/babel/babel/issues/10261#issuecomment-549940457
        version: require('@babel/helpers/package.json').version,
      } as any;
    }
    if (options.envName === 'esm') {
      const runtimeVersion = semver.clean(require('@babel/runtime/package.json').version);
      presetOptions.modules = false;
      presetOptions.transformRuntime = {
        // [@babel/plugin-transform-runtime] The 'useESModules' option is not necessary when using
        // a @babel/runtime version >= 7.13.0 and not using the 'absoluteRuntime' option,
        // because it automatically detects the necessary module format.
        useESModules: !semver.gte(runtimeVersion, '7.13.0'),
        version: require('@babel/helpers/package.json').version,
      } as any;
    }
    babelOptions = {
      presets: [
        [require.resolve('@tsbb/babel-preset-tsbb'), { ...presetOptions }],
        require.resolve('@babel/preset-react'),
      ],
    };
  } else if (targets === 'node') {
    babelOptions = {
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: { node: true },
          },
        ],
        require.resolve('@babel/preset-typescript'),
      ],
      plugins: [
        require.resolve('babel-plugin-add-module-exports'),
        require.resolve('babel-plugin-transform-typescript-metadata'),
        [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
        [require.resolve('@babel/plugin-proposal-class-properties'), { loose: true }],
      ],
    };
  }
  return new Promise<ITransformResult>((resolve: (value?: ITransformResult) => ITransformResult | any, reject) => {
    if (!/^(cjs|esm)$/.test(options.envName) && targets !== 'node') {
      loadOptions({ envName: options.envName || process.env.BABEL_ENV });
      babelOptions.presets = [];
    }
    transformFile(
      filePath,
      {
        envName: options.envName || process.env.BABEL_ENV,
        presets: [],
        ...babelOptions,
        // comments: process.env.NODE_ENV === 'development' ? false : true,
        // comments: false,
        sourceMaps: options.sourceMaps === 'none' ? false : options.sourceMaps,
        sourceFileName: path.relative(path.dirname(options.outputPath), filePath),
      },
      (err, result: ITransformResult) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      },
    );
  });
};
