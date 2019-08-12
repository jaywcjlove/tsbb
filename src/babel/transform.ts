import path from 'path';
import { transformFile, BabelFileResult, TransformOptions, loadOptions } from '@babel/core';

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
  let babelOptions: TransformOptions = {}
  if (targets === 'react') {
    if (options.envName === 'cjs') {
      babelOptions = {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            modules: 'cjs',
            targets: { browsers: ['last 2 versions'] },
            transformRuntime: {},
          }],
          require.resolve('@babel/preset-react'),
        ],
      }
    }
    if (options.envName === 'esm') {
      babelOptions = {
        presets: [
          [require.resolve('@tsbb/babel-preset-tsbb'), {
            modules: false,
            targets: { browsers: ['last 2 versions'] },
            transformRuntime: { useESModules: true }
          }],
          require.resolve('@babel/preset-react'),
        ]
      }
    }
  }
  return new Promise<ITransformResult>((resolve: (value?: ITransformResult) => ITransformResult | any, reject) => {
    if (!/^(cjs|esm)$/.test(options.envName) && targets !== 'node') {
      loadOptions({ envName: options.envName || process.env.BABEL_ENV });
      babelOptions.presets = [];
    }
    transformFile(filePath, {
      envName: options.envName || process.env.BABEL_ENV,
      presets: [
        [require.resolve('@tsbb/babel-preset-tsbb'), {
          modules: 'cjs',
          transformRuntime: {}
        }]
      ],
      ...babelOptions,
      // comments: process.env.NODE_ENV === 'development' ? false : true,
      // comments: false,
      sourceMaps: options.sourceMaps === 'none' ? false : options.sourceMaps,
      sourceFileName: path.relative(path.dirname(options.outputPath), filePath),
    }, (err, result: ITransformResult) => {
      if (err) {
        reject(err)
      } else {
        resolve(result);
      }
    });
  });
}